import Link from 'next/link';

interface CalculatorLinkCardProps {
  href: string;
  title: string;
  description?: string;
  color?: string;
}

export default function CalculatorLinkCard({ href, title, description, color = "blue" }: CalculatorLinkCardProps) {
  const hoverColors: Record<string, string> = {
    blue: "hover:border-blue-300 group-hover:text-blue-600",
    green: "hover:border-green-300 group-hover:text-green-600",
    indigo: "hover:border-indigo-300 group-hover:text-indigo-600",
    purple: "hover:border-purple-300 group-hover:text-purple-600",
    orange: "hover:border-orange-300 group-hover:text-orange-600",
  };

  return (
    <Link href={href} className="group">
      <div className={`bg-white rounded-lg p-3 border border-gray-200 ${hoverColors[color] || hoverColors.blue} hover:shadow-sm transition-all h-full`}>
        <h3 className={`text-sm font-medium text-gray-900 ${hoverColors[color]?.split(' ')[1] || 'group-hover:text-blue-600'}`}>{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </Link>
  );
}

export function SimpleLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="block p-2.5 bg-white border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-700 transition-colors"
    >
      {title}
    </Link>
  );
}
