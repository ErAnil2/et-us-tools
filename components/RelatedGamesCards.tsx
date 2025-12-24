import Link from 'next/link';

interface Game {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  title: string;
  games: Game[];
}

const GameIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'puzzle':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
        </svg>
      );
    case 'cards':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.47 4.35l-1.34-.56v9.03l2.43-5.86c.41-1.02-.06-2.19-1.09-2.61zm-19.5 3.7L6.93 20a2.01 2.01 0 001.81 1.26c.26 0 .53-.05.79-.16l7.37-3.05c.75-.31 1.21-1.05 1.21-1.85V5.5c0-1.1-.9-2-2-2H5.87c-.8 0-1.54.46-1.9 1.18l-1.9 4.37z"/>
        </svg>
      );
    case 'brain':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 2C8.38 2 7.5 2.88 7.5 4c0 .74.41 1.38 1.01 1.73-.52-.27-.99-.73-.99-1.73 0-.28.22-.5.5-.5s.5.22.5.5c0 1.5 1.5 3 1.5 3s1.5-1.5 1.5-3c0-.28.22-.5.5-.5s.5.22.5.5c0 1-.47 1.46-.99 1.73.6-.35 1.01-.99 1.01-1.73 0-1.12-.88-2-2-2h-1z"/>
        </svg>
      );
    case 'game':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.54 5.54L13.77 7.31 12 5.54 10.23 7.31 8.46 5.54 12 2l3.54 3.54zM7.31 10.23L5.54 8.46 2 12l3.54 3.54 1.77-1.77L7.31 10.23zm9.38 0l-1.77 3.54 1.77 1.77L22 12l-3.54-3.54-1.77 1.77zm-3.23 6.46L12 18.46l-1.46-1.46L8.77 18.77 12 22l3.23-3.23-1.54-1.54z"/>
        </svg>
      );
    case 'target':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-8c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/>
        </svg>
      );
    case 'memory':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    case 'speed':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-.27-10.43zM10.59 15.41a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z"/>
        </svg>
      );
    case 'blocks':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      );
    case 'math':
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.54 5.54L13.77 7.31 12 5.54 10.23 7.31 8.46 5.54 12 2l3.54 3.54zM7.31 10.23L5.54 8.46 2 12l3.54 3.54 1.77-1.77L7.31 10.23zm9.38 0l-1.77 3.54 1.77 1.77L22 12l-3.54-3.54-1.77 1.77zm-3.23 6.46L12 18.46l-1.46-1.46L8.77 18.77 12 22l3.23-3.23-1.54-1.54z"/>
        </svg>
      );
  }
};

export default function RelatedGamesCards({ title, games }: Props) {
  const displayGames = games.slice(0, 6);

  return (
    <section className="bg-gray-50 rounded-xl p-8 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayGames.map((game, index) => (
          <Link key={index} href={game.href} className="group">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group-hover:border-pink-300">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${game.color} flex items-center justify-center flex-shrink-0`}>
                  <GameIcon icon={game.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-pink-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{game.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
