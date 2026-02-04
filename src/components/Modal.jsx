import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, content, image }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-500" />
                </button>

                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4 font-heading">{title}</h2>

                    {image && (
                        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img src={image} alt={title} className="w-full h-64 object-cover" />
                        </div>
                    )}

                    <div className="text-lg text-gray-700 leading-relaxed font-body">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
