interface SeoContentProps {
  content?: string;
}

export default function SeoContent({ content }: SeoContentProps) {
  if (!content) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 mt-8">
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
