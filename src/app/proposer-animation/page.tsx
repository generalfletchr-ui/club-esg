/* Proposer une animation — formulaire + historique des propositions du membre */
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import Tag from "@/components/ui/Tag";
import ProposerAnimationForm from "@/components/features/ProposerAnimationForm";
import {
  ANIMATION_FORMATS,
  STATUT_LABELS,
  STATUT_VARIANTS,
  formatDateLongue,
  formatHeure,
  parisToday,
} from "@/lib/animations";
import { fetchAgenda } from "@/lib/animation-workflow";
import type { AnimationProposal } from "@/types";

export default async function ProposerAnimationPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  const { data } = await supabase
    .from("animation_proposals")
    .select("*")
    .eq("member_id", member.id)
    .order("created_at", { ascending: false });

  const proposals = (data ?? []) as AnimationProposal[];
  const agenda = await fetchAgenda(supabase);

  return (
    <AppLayout isAdmin={isAdmin}>
      <div className="max-w-[760px]">
        <div className="mb-4">
          <h1 className="text-[22px] font-bold text-[#111827]">Proposer une animation</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Partagez votre expertise avec les membres du Club lors d&apos;un webinaire ou d&apos;un atelier.
            Chaque proposition est relue par l&apos;équipe avant d&apos;être publiée dans l&apos;agenda.
          </p>
        </div>

        <ProposerAnimationForm prenom={member.prenom} nom={member.nom} today={parisToday()} agenda={agenda} />

        {/* ── Mes propositions ─────────────────────────────────── */}
        <h2 className="text-[15px] font-bold text-[#111827] mt-8 mb-3">Mes propositions</h2>
        {proposals.length === 0 ? (
          <p className="text-[12px] text-[#9ca3af]">Vous n&apos;avez encore proposé aucune animation.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {proposals.map((p) => (
              <div key={p.id} className="bg-white border border-[#e5e7eb] rounded-[8px] p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Tag variant={STATUT_VARIANTS[p.statut]}>{STATUT_LABELS[p.statut]}</Tag>
                  <span className="text-[11px] text-[#6b7280]">
                    {ANIMATION_FORMATS[p.format].label} · {formatDateLongue(p.date_souhaitee)} à {formatHeure(p.heure)}
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-[#111827]">{p.titre}</p>
                {p.message_admin && (p.statut === "a_ajuster" || p.statut === "refusee") && (
                  <p className="text-[12px] text-[#374151] bg-[#f5f6f8] rounded-[6px] px-3 py-2 mt-2 whitespace-pre-line">
                    <span className="font-semibold">Message de l&apos;équipe : </span>
                    {p.message_admin}
                  </p>
                )}
                {p.statut === "a_ajuster" && (
                  <Link
                    href={`/proposer-animation/${p.id}`}
                    className="inline-flex mt-3 px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
                  >
                    Modifier ma proposition
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
