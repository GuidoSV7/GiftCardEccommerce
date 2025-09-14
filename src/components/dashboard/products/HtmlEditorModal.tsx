import { useState } from 'react';

interface HtmlEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string) => void;
    title: string;
    description: string;
    initialContent: string;
    placeholder: string;
    color: 'blue' | 'green' | 'yellow';
}

export default function HtmlEditorModal({
    isOpen,
    onClose,
    onSave,
    title,
    description,
    initialContent,
    placeholder,
    color
}: HtmlEditorModalProps) {
    const [tempContent, setTempContent] = useState(initialContent);

    const colorClasses = {
        blue: {
            focus: 'focus:border-blue-500 focus:ring-blue-200',
            button: 'bg-blue-600 hover:bg-blue-700'
        },
        green: {
            focus: 'focus:border-green-500 focus:ring-green-200',
            button: 'bg-green-600 hover:bg-green-700'
        },
        yellow: {
            focus: 'focus:border-yellow-500 focus:ring-yellow-200',
            button: 'bg-yellow-600 hover:bg-yellow-700'
        }
    };

    const handleSave = () => {
        onSave(tempContent);
        onClose();
    };

    const handleClose = () => {
        setTempContent(initialContent);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
                    >
                        ×
                    </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0">
                    <div className="space-y-3 flex flex-col">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Editor HTML
                        </label>
                        <textarea
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            className={`w-full h-[60vh] p-4 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none ${colorClasses[color].focus} transition-all overflow-y-auto`}
                            placeholder={placeholder}
                        />
                    </div>
                    <div className="space-y-3 flex flex-col">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Vista Previa
                        </label>
                        <div className="w-full h-[60vh] border-2 border-gray-200 rounded-lg p-4 bg-white overflow-y-auto shadow-inner">
                            {tempContent ? (
                                <div dangerouslySetInnerHTML={{ __html: tempContent }} />
                            ) : (
                                <div className="flex items-center justify-center h-full min-h-[200px]">
                                    <p className="text-gray-400 text-center">
                                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Escribe HTML para ver la vista previa
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`flex-1 ${colorClasses[color].button} text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200`}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
