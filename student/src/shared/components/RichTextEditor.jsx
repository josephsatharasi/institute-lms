import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Strikethrough } from 'lucide-react';

export function RichTextEditor({ value, onChange, placeholder = 'Enter text...' }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
    updateActiveFormats();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    });
  };

  const handleInput = () => {
    updateContent();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyUp = () => {
    updateActiveFormats();
  };

  const handleMouseUp = () => {
    updateActiveFormats();
  };

  const ToolbarButton = ({ onClick, icon: Icon, title, isActive }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-2.5 transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'hover:bg-gray-200 text-gray-700'
      }`}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className={`rounded-xl border-2 transition-all ${
      isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300'
    } bg-white overflow-hidden`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-3">
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
          isActive={activeFormats.bold}
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
          isActive={activeFormats.italic}
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
          isActive={activeFormats.underline}
        />
        <ToolbarButton
          onClick={() => execCommand('strikeThrough')}
          icon={Strikethrough}
          title="Strikethrough"
          isActive={activeFormats.strikeThrough}
        />
        
        <div className="mx-2 h-8 w-px bg-gray-300" />
        
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
        
        <div className="mx-2 h-8 w-px bg-gray-300" />
        
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          icon={AlignRight}
          title="Align Right"
        />
        
        <div className="mx-2 h-8 w-px bg-gray-300" />
        
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="rounded-lg border-2 border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="ml-2 h-10 w-12 cursor-pointer rounded-lg border-2 border-gray-300"
          title="Text Color"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        className="min-h-[150px] p-4 text-base leading-relaxed focus:outline-none"
        data-placeholder={placeholder}
        style={{
          overflowWrap: 'break-word',
          fontSize: '16px'
        }}
      />
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
          font-style: italic;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
