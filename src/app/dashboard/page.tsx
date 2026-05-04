import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile, calcProfileCompletion } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { WHATSAPP_LINK } from "@/lib/constants";
import type { Event, Member } from "@/types";

/* Icônes par type d'événement */
const EVENT_ICONS: Record<string, string> = {
  Webinaire: "🎙",
  Afterwork: "🤝",
  Workshop:  "📋",
};

/* Formate une date ISO en "12 mai · 12h00" */
function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day   = d.getDate();
  const month = d.toLocaleDateString("fr-FR", { month: "long" });
  const hours = String(d.getHours()).padStart(2, "0");
  const mins  = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} · ${hours}h${mins}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const user     = await getAuthUser();
  const member   = await getMemberProfile(user.id);

  /* Membre non approuvé → page d'attente */
  if (member.statut !== "approved") {
    redirect("/en-attente");
  }

  const isAdmin       = member.role === "admin";
  const isFirstVisit  = !member.premiere_connexion;

  /* Marquer la première connexion */
  if (isFirstVisit) {
    await supabase
      .from("members")
      .update({ premiere_connexion: new Date().toISOString() })
      .eq("id", user.id);
  }

  /* 2 prochains événements */
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("date_heure", new Date().toISOString())
    .order("date_heure", { ascending: true })
    .limit(2);

  /* 3 derniers membres approuvés (hors soi-même) */
  const { data: newMembers } = await supabase
    .from("members")
    .select("id, prenom, nom, photo_url, type_membre, fonction, entreprise")
    .eq("statut", "approved")
    .neq("id", user.id)
    .order("date_inscription", { ascending: false })
    .limit(3);

  const completion = calcProfileCompletion(member);

  return (
    <AppLayout isAdmin={isAdmin}>
      <div className="space-y-4">

        {/* ── En-tête bienvenue ─────────────────────────────── */}
        <div>
          <p className="text-[13px] font-medium text-[#016050] mb-0.5">
            Bonjour, {member.prenom},
          </p>
          <h1 className="text-[24px] font-bold text-[#111827]">
            {isFirstVisit
              ? "Bienvenue dans le Club ! 🎉"
              : `Bienvenue ${member.prenom} !`}
          </h1>
        </div>

        {/* ── Barre de complétion du profil ────────────────── */}
        {completion < 100 && (
          <Card>
            <div className="flex items-center gap-5">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-[#374151]">
                    Complétion du profil
                  </span>
                  <span className="text-[13px] font-bold text-[#016050]">
                    {completion}%
                  </span>
                </div>
                <div className="h-[5px] bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1.5">
                  {!member.photo_url && "Ajoute ta photo de profil · "}
                  {!member.linkedin && "LinkedIn · "}
                  {!member.telephone && "Téléphone"}
                  {" "}pour compléter ton profil.
                </p>
              </div>
              <Link
                href="/mon-profil"
                className="flex-shrink-0 px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap"
              >
                Compléter mon profil →
              </Link>
            </div>
          </Card>
        )}

        {/* ── Grille 2 colonnes ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Prochains événements */}
          <Card>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-semibold text-[#111827]">
                Prochains événements
              </span>
              <Link
                href="/agenda"
                className="text-[11px] font-semibold text-[#016050] hover:underline"
              >
                Voir tout →
              </Link>
            </div>

            {events && events.length > 0 ? (
              <div className="flex flex-col">
                {(events as Event[]).map((ev, i) => (
                  <div
                    key={ev.id}
                    className="flex gap-2.5 py-2.5"
                    style={{ borderTop: i > 0 ? "1px solid #e5e7eb" : undefined }}
                  >
                    <div className="w-[34px] h-[34px] rounded-[8px] bg-[#e6f2ef] flex items-center justify-center flex-shrink-0 text-base">
                      {EVENT_ICONS[ev.type_event] ?? "📅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-0.5">
                        <Tag variant="teal">{ev.type_event}</Tag>
                      </div>
                      <p className="text-[12px] font-semibold text-[#111827] truncate">
                        {ev.titre}
                      </p>
                      <p className="text-[11px] text-[#6b7280]">
                        {formatEventDate(ev.date_heure)}
                      </p>
                    </div>
                    <a
                      href={ev.lien_inscription}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 self-center px-3 py-1.5 rounded-[6px] text-[11px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
                    >
                      S&apos;inscrire
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#9ca3af] py-4 text-center">
                Aucun événement à venir pour l&apos;instant.
              </p>
            )}
          </Card>

          {/* Nouveaux membres */}
          <Card>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-semibold text-[#111827]">
                Nouveaux membres
              </span>
              <Link
                href="/annuaire"
                className="text-[11px] font-semibold text-[#016050] hover:underline"
              >
                Annuaire →
              </Link>
            </div>

            {newMembers && newMembers.length > 0 ? (
              <div className="flex flex-col">
                {(newMembers as Partial<Member>[]).map((m, i) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2.5 py-2.5"
                    style={{ borderTop: i > 0 ? "1px solid #e5e7eb" : undefined }}
                  >
                    <Avatar
                      prenom={m.prenom}
                      nom={m.nom}
                      photoUrl={m.photo_url}
                      size={30}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#111827] truncate">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="text-[11px] text-[#6b7280] truncate">
                        {m.type_membre} · {m.entreprise}
                      </p>
                    </div>
                    <Link
                      href={`/annuaire/${m.id}`}
                      className="flex-shrink-0 text-[11px] font-medium text-[#016050] hover:underline"
                    >
                      Voir →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#9ca3af] py-4 text-center">
                Tu es l&apos;un des premiers membres !
              </p>
            )}
          </Card>
        </div>

        {/* ── Groupe WhatsApp ───────────────────────────────── */}
        <div className="rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[22px]">💬</span>
            <div>
              <p className="text-[13px] font-semibold text-[#166534]">
                Groupe WhatsApp communautaire
              </p>
              <p className="text-[11px] text-[#16a34a]">
                Rejoins les échanges rapides et informels avec les membres
              </p>
            </div>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] transition-colors"
          >
            Rejoindre →
          </a>
        </div>

      </div>
    </AppLayout>
  );
}
