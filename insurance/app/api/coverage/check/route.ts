import { z } from "zod";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeCoverage } from "@/lib/serializers";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

const schema = z.object({
  policyId: z.string().min(1),
  scenario: z.string().min(1).describe("Plain-English description of what happened"),
});

/** Map a plain-English scenario to a coverage key, given the policy type. */
function matchKey(type: string, s: string): string | null {
  const t = s.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  if (has(/uninsured|underinsured|hit[- ]and[- ]run|no insurance|fled/)) return "uninsured_motorist";
  if (type === "auto") {
    if (has(/glass|windshield|window/)) return "comprehensive";
    if (has(/theft|stolen|stole|broke in|break[- ]in|burglar/)) return "comprehensive";
    if (has(/hail|flood|storm|weather|fire|tree|animal|deer|vandal|hurricane|tornado|nature/)) return "comprehensive";
    if (has(/tow|stranded|flat tire|battery|locked out|roadside/)) return "roadside";
    if (has(/at fault|hit (a|an|another|the)|rear[- ]?end|collision|crash|accident|backed into|fender/)) return "collision";
    if (has(/injur|hurt|medical|bodily|someone'?s? car|their car|property/)) return "liability";
  } else {
    if (has(/water|pipe|burst|leak|fire|smoke|storm|wind|hail|tree|roof|structural|damage to (the )?(house|home|dwelling)/)) return "dwelling";
    if (has(/belongings|laptop|contents|furniture|electronics|jewelry|stolen|theft|tv/)) return "personal_property";
    if (has(/dog bite|someone (got )?(hurt|injured)|slip|guest|liabilit|sued/)) return "liability_home";
    if (has(/can'?t live|hotel|displaced|temporary|loss of use/)) return "loss_of_use";
  }
  return null;
}

/** POST /api/coverage/check — "is this covered?" reasoning over the policy. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const { policyId, scenario } = await parseBody(req, schema);
  const policy = await resolvePolicy(c.id, policyId);

  const key = matchKey(policy.type, scenario);
  const match = key ? policy.coverages.find((cov) => cov.key === key) : undefined;
  const covered = Boolean(match && match.included);

  return json({
    covered,
    coverage: match ? serializeCoverage(match) : null,
    policyNumber: policy.policyNumber,
    explanation: covered
      ? `Yes — this looks like a "${match!.label}" situation, which is covered on ${policy.policyNumber}${match!.deductibleCents > 0 ? ` (deductible applies)` : ""}.`
      : key
        ? `This would fall under "${key}", which isn't on ${policy.policyNumber}. You may want to add it.`
        : `I couldn't map that to a specific coverage. Your policy includes: ${policy.coverages.map((x) => x.label).join(", ")}.`,
    coverages: policy.coverages.map(serializeCoverage),
  });
});
