import { useRef, useState } from 'react';

export default function ImageUpload({ value, onChange, label = 'Product Image' }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, WebP, or GIF images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
      setLoading(false);
    };
    reader.onerror = () => { setError('Failed to read file'); setLoading(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <div className="flex items-start gap-4">
        <div
          className="w-32 h-32 rounded-xl border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden bg-stone-50 shrink-0 cursor-pointer hover:border-amber-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-stone-400 text-xs p-2">
              <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Click to upload
            </div>
          )}
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={loading}
            className="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors disabled:opacity-50">
            {loading ? 'Loading...' : 'Choose Image'}
          </button>
          <div className="mt-2">
            <label className="block text-xs text-stone-500 mb-1">Or paste image URL:</label>
            <input type="text" value={value && value.startsWith('data:') ? '' : (value || '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          {value && !value.startsWith('data:') && (
            <p className="text-xs text-stone-400 mt-1">Using URL: {value.length > 40 ? value.slice(0, 40) + '...' : value}</p>
          )}
          {value && value.startsWith('data:') && (
            <p className="text-xs text-teal-600 mt-1">Image uploaded successfully</p>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
