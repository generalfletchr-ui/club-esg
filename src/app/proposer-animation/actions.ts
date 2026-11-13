"use server";

/* Server Actions — propositions d'animation (membre) */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import { parisToday, type ProposalInput } from "@/lib/animations";
import { resubmitProposal, submitProposal } from "@/lib/animation-workflow";

async function requireApprovedMember() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);
  if (member.statut !== "approved") throw new Error("Accès refusé");
  return member;
}

export async function proposeAnimation(input: ProposalInput) {
  const member = await requireApprovedMember();
  const result = await submitProposal(await createClient(), member, input, parisToday());

  revalidatePath("/proposer-animation");
  revalidatePath("/admin/animations");
  return result;
}

export async function updateAnimationProposal(proposalId: string, input: ProposalInput) {
  const member = await requireApprovedMember();
  const result = await resubmitProposal(await createClient(), member, proposalId, input, parisToday());

  revalidatePath("/proposer-animation");
  revalidatePath("/admin/animations");
  return result;
}
