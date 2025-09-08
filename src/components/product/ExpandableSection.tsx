interface ExpandableSectionProps {
    title: string;
    content: string;
    isExpanded: boolean;
    onToggle: () => void;
    isSmallText?: boolean;
}

export const ExpandableSection = ({ 
    title, 
    content, 
    isExpanded, 
    onToggle, 
    isSmallText = false 
}: ExpandableSectionProps) => {
    const renderHtmlContent = (content: string) => {
        return { __html: content };
    };

    return (
        <div className="bg-gray-800/30 rounded-lg">
            <button 
                onClick={onToggle}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
            >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isExpanded && (
                <div className="px-4 pb-4">
                    <div 
                        className={`text-gray-300 leading-relaxed prose prose-invert max-w-none ${isSmallText ? 'text-sm' : ''}`}
                        dangerouslySetInnerHTML={renderHtmlContent(content)}
                    />
                </div>
            )}
        </div>
    );
};
