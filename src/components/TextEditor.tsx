"use client";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;  // Add a new prop for initial content
}

const TextEditor: React.FC<TextEditorProps> = ({ onChange, initialContent }) => {

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      import("quill").then((Quill) => {
        const quill = new Quill.default(editorRef.current as HTMLElement, {
          theme: "snow",
          modules: {
            toolbar: {
              container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["link", "image", "code-block"],
                ["blockquote", "strike", "code"],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
              ],
              handlers: {
                image: imageHandler,
                link: linkHandler,
              },
            },
            clipboard: {
              matchVisual: false, // Preserve formatting on paste
            },
            history: {
              delay: 1000,
              maxStack: 100,
              userOnly: true,
            },
          },
        });

        if (initialContent) {
          quill.root.innerHTML = initialContent; 
        }

        quill.on("text-change", () => {
          const currentContent = quill.root.innerHTML;
          console.log("Current content:", currentContent);
          onChange(currentContent);
        });

        function imageHandler() {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = () => {
            const file = input.files ? input.files[0] : null;
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const range = quill.getSelection();
                if (range) {
                  quill.insertEmbed(range.index, "image", e.target?.result);
                }
              };
              reader.readAsDataURL(file);
            }
          };
        }

        // Custom Link Handler
        function linkHandler() {
          const url = prompt("Enter the URL");
          if (url) {
            const range = quill.getSelection();
            quill.format("link", url);
          }
        }

        // Create custom Undo and Redo buttons
        const undoButton = document.createElement("button");
        undoButton.className = "ql-undo";
        undoButton.innerHTML = "Undo";
        undoButton.onclick = () => quill.history.undo();

        const redoButton = document.createElement("button");
        redoButton.className = "ql-redo";
        redoButton.innerHTML = "Redo";
        redoButton.onclick = () => quill.history.redo();

        // Append the custom controls to the toolbar only if they are not already there
        const toolbar = document.querySelector(".ql-toolbar");
        if (toolbar && !toolbar.querySelector(".ql-custom-controls")) {
          const customControls = document.createElement("span");
          customControls.className = "ql-custom-controls";
          customControls.appendChild(undoButton);
          customControls.appendChild(redoButton);
          toolbar.appendChild(customControls);
        }
      });
    }
  }, []);

  return (
    <div className="editor-container">
      <div ref={editorRef} className="quill-editor" />
    </div>
  );
};

export default TextEditor;
