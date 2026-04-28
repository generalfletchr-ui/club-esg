/* Fiche membre détaillée */
export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-bleu-fonce mb-6">
        Profil membre
      </h1>
      <p className="text-texte-secondaire">
        Fiche membre détaillée à venir (Jour 3)
      </p>
    </div>
  );
}
