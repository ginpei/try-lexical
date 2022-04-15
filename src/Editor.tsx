import LexicalComposer from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import LexicalRichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import LexicalTreeView from "@lexical/react/LexicalTreeView";
import { $getRoot, $getSelection, EditorState, FORMAT_TEXT_COMMAND } from 'lexical';
import { useEffect } from 'react';
import "./Editor.css";

type LexicalComposerInitialConfig = Parameters<
  typeof LexicalComposer
>[0]['initialConfig'];

const placeholder = (
  <p className="Editor-placeholder">Enter some text...</p>
);

const initialConfig: LexicalComposerInitialConfig = {
  /**
   * Theme styling goes here
   */
  theme: {
    // ...
  },

  /**
   * Catch any errors that occur during Lexical updates and log them
   * or throw them as needed. If you don't throw them, Lexical will
   * try to recover gracefully without losing user data.
   */
  onError(error: unknown) { console.error(error); },
};

export function Editor() {
  return (
    <div className="Editor">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <LexicalRichTextPlugin
          contentEditable={<LexicalContentEditable />}
          placeholder={placeholder}
        />
        <LexicalOnChangePlugin onChange={onChange} />
        <TreeViewPlugin />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const onBoldClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  return (
    <div className="Editor-toolbar">
      <button onClick={onBoldClick}>Bold</button>
    </div>
  );
}

function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <LexicalTreeView
      editor={editor}
      timeTravelButtonClassName="Editor-treeView-timeTravel-button"
      timeTravelPanelButtonClassName="Editor-treeView-timeTravel-sliderButton"
      timeTravelPanelClassName="Editor-treeView-timeTravel-panel"
      timeTravelPanelSliderClassName="Editor-treeView-timeTravel-slider"
      viewClassName="Editor-treeView"
    />
  );
}

/**
 * Lexical React plugins are React components, which makes them
 * highly composable. Furthermore, you can lazy load plugins if
 * desired, so you don't pay the cost for plugins until you
 * actually use them.
 */
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

/**
 * When the editor changes, you can get notified via the
 * `LexicalOnChangePlugin`!
 */
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}
