/* Modifier une proposition d'animation « À ajuster » (lien du mail d'ajustement) */
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import ProposerAnimationForm from "@/components/features/ProposerAnimationForm";
import { STATUT_LABELS, parisToday } from "@/lib/animations";
import { fetchAgenda } from "@/lib/animation-workflow";
import type { AnimationProposal } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModifierPropositionPage({ params }: Props) {
  const { id } = await params;

  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  /* RLS : un membre ne lit que ses propres propositions */
  const { data } = await supabase
    .from("animation_proposals")
    .select("*")
    .eq("id", id)
    .eq("member_id", member.id)
    .single();

  if (!data) notFound();
  const proposal = data as AnimationProposal;
  const agenda = await fetchAgenda(supabase);

  return (
    <AppLayout isAdmin={isAdmin}>
      <div className="max-w-[760px]">
        <Link href="/proposer-animation" className="text-[12px] text-[#016050] font-medium hover:underline">
          ← Mes propositions
        </Link>
        <h1 className="text-[22px] font-bold text-[#111827] mt-2 mb-4">Modifier ma proposition</h1>

        {proposal.statut === "a_ajuster" ? (
          <ProposerAnimationForm
            prenom={member.prenom}
            nom={member.nom}
            today={parisToday()}
            agenda={agenda}
            proposal={proposal}
          />
        ) : (
          <p className="text-[13px] text-[#6b7280] bg-white border border-[#e5e7eb] rounded-[8px] px-5 py-6">
            Cette proposition est au statut « {STATUT_LABELS[proposal.statut]} » : elle ne peut plus être modifiée.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
