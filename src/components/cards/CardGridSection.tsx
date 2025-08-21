import React from 'react';

interface CardItemProps {
    image: string;
    title: string;
    alt: string;
}

interface SectionProps {
    title: string;
    items: CardItemProps[];
}

const CardItem: React.FC<CardItemProps> = ({ image, title, alt }) => (
    <div className="group cursor-pointer">
        <div className="bg-gray-100 rounded-lg p-4 transition-colors group-hover:bg-gray-50">
            <img 
                src={image}
                alt={alt}
                className='w-full h-auto rounded-lg mb-3'
            />
            <p className='text-center text-sm font-medium text-gray-700 group-hover:text-blue-600'>{title}</p>
        </div>
    </div>
);

interface CardGridSectionProps {
    sections: SectionProps[];
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({ sections }) => {
    return (
        <div className="px-10 md:px-16 py-12 bg-white">
            <div className="flex flex-col lg:flex-row gap-8">
                {sections.map((section, index) => (
                    <div key={index} className="flex-1 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{section.title}</h2>
                        <div className="grid grid-cols-2 grid-rows-2 gap-4">
                            {section.items.slice(0, 4).map((item, idx) => (
                                <CardItem 
                                    key={idx}
                                    image={item.image}
                                    title={item.title}
                                    alt={item.alt}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
