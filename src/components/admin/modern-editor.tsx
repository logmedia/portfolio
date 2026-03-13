'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Box, 
  Button, 
  HStack, 
  Icon, 
  Tooltip, 
  IconButton,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import { 
  TextBolder, 
  TextItalic, 
  TextUnderline, 
  ListBullets, 
  ListNumbers, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Quotes,
  Code,
  TextStrikethrough,
  ArrowUUpLeft,
  ArrowUUpRight,
  TextHOne,
  TextHTwo,
  TextHThree,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  Table as TableIcon,
} from 'phosphor-react';
import { useEffect } from 'react';

interface ModernEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL da Imagem');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do Link', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <HStack 
      px={3} 
      py={2} 
      borderBottom="1px solid" 
      borderColor="whiteAlpha.100" 
      bg="blackAlpha.400" 
      spacing={1} 
      flexWrap="wrap"
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
    >
      <HStack spacing={1}>
        <Tooltip label="Desfazer">
          <IconButton
            aria-label="Undo"
            icon={<ArrowUUpLeft />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            isDisabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip label="Refazer">
          <IconButton
            aria-label="Redo"
            icon={<ArrowUUpRight />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            isDisabled={!editor.can().redo()}
          />
        </Tooltip>
      </HStack>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" mx={2} />

      <HStack spacing={1}>
        <Tooltip label="Negrito">
          <IconButton
            aria-label="Bold"
            icon={<TextBolder />}
            size="sm"
            variant={editor.isActive('bold') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('bold') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip label="Itálico">
          <IconButton
            aria-label="Italic"
            icon={<TextItalic />}
            size="sm"
            variant={editor.isActive('italic') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('italic') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip label="Sublinhado">
          <IconButton
            aria-label="Underline"
            icon={<TextUnderline />}
            size="sm"
            variant={editor.isActive('underline') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('underline') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </Tooltip>
        <Tooltip label="Riscado">
          <IconButton
            aria-label="Strike"
            icon={<TextStrikethrough />}
            size="sm"
            variant={editor.isActive('strike') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('strike') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </Tooltip>
      </HStack>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" mx={2} />

      <HStack spacing={1}>
        <Tooltip label="Título 1">
          <IconButton
            aria-label="H1"
            icon={<TextHOne />}
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('heading', { level: 1 }) ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
        </Tooltip>
        <Tooltip label="Título 2">
          <IconButton
            aria-label="H2"
            icon={<TextHTwo />}
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('heading', { level: 2 }) ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
        </Tooltip>
      </HStack>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" mx={2} />

      <HStack spacing={1}>
        <Tooltip label="Lista com Bullets">
          <IconButton
            aria-label="Bullet List"
            icon={<ListBullets />}
            size="sm"
            variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('bulletList') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Tooltip label="Lista Numerada">
          <IconButton
            aria-label="Ordered List"
            icon={<ListNumbers />}
            size="sm"
            variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('orderedList') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
      </HStack>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" mx={2} />

      <HStack spacing={1}>
        <Tooltip label="Link">
          <IconButton
            aria-label="Link"
            icon={<LinkIcon />}
            size="sm"
            variant={editor.isActive('link') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('link') ? 'brand' : 'gray'}
            onClick={setLink}
          />
        </Tooltip>
        <Tooltip label="Imagem">
          <IconButton
            aria-label="Image"
            icon={<ImageIcon />}
            size="sm"
            variant="ghost"
            onClick={addImage}
          />
        </Tooltip>
        <Tooltip label="Citação">
          <IconButton
            aria-label="Blockquote"
            icon={<Quotes />}
            size="sm"
            variant={editor.isActive('blockquote') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('blockquote') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </Tooltip>
        <Tooltip label="Bloco de Código">
          <IconButton
            aria-label="Code Block"
            icon={<Code />}
            size="sm"
            variant={editor.isActive('codeBlock') ? 'solid' : 'ghost'}
            colorScheme={editor.isActive('codeBlock') ? 'brand' : 'gray'}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </Tooltip>
      </HStack>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" mx={2} />

      <Menu size="sm">
        <Tooltip label="Tabela">
          <MenuButton
            as={IconButton}
            aria-label="Table"
            icon={<TableIcon />}
            size="sm"
            variant="ghost"
          />
        </Tooltip>
        <Portal>
          <MenuList bg="gray.800" borderColor="whiteAlpha.200" zIndex={1000}>
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              Inserir Tabela
            </MenuItem>
            <Divider />
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().addColumnBefore().run()}>Adicionar Coluna Antes</MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().addColumnAfter().run()}>Adicionar Coluna Depois</MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().deleteColumn().run()}>Excluir Coluna</MenuItem>
            <Divider />
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().addRowBefore().run()}>Adicionar Linha Antes</MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().addRowAfter().run()}>Adicionar Linha Depois</MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} onClick={() => editor.chain().focus().deleteRow().run()}>Excluir Linha</MenuItem>
            <Divider />
            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} color="red.300" onClick={() => editor.chain().focus().deleteTable().run()}>Excluir Tabela</MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </HStack>
  );
};

export function ModernEditor({ initialContent, onChange }: ModernEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // Avoid internal conflicts by picking what we want
        bold: false,
        italic: false,
        strike: false,
      }),
      Bold,
      Italic,
      Strike,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder: 'Comece a escrever aqui...',
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        style: 'min-height: 300px; padding: 20px; color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.6;',
      },
    },
  });

  // Atualizar conteúdo apenas se houver mudança externa real e o editor não estiver em foco
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  return (
    <Box 
      className="modern-editor"
      border="1px solid" 
      borderColor="whiteAlpha.100" 
      borderRadius="xl" 
      overflow="hidden"
      bg="blackAlpha.300"
      _focusWithin={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
      transition="all 0.2s"
    >
      <MenuBar editor={editor} />
      
      {editor && (
        <BubbleMenu editor={editor}>
          <HStack 
            bg="gray.800" 
            p={1} 
            borderRadius="md" 
            boxShadow="xl" 
            border="1px solid" 
            borderColor="whiteAlpha.200"
            spacing={1}
          >
            <IconButton
              aria-label="Bold"
              icon={<TextBolder />}
              size="xs"
              variant={editor.isActive('bold') ? 'solid' : 'ghost'}
              colorScheme={editor.isActive('bold') ? 'brand' : 'gray'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <IconButton
              aria-label="Italic"
              icon={<TextItalic />}
              size="xs"
              variant={editor.isActive('italic') ? 'solid' : 'ghost'}
              colorScheme={editor.isActive('italic') ? 'brand' : 'gray'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <IconButton
              aria-label="Link"
              icon={<LinkIcon />}
              size="xs"
              variant={editor.isActive('link') ? 'solid' : 'ghost'}
              colorScheme={editor.isActive('link') ? 'brand' : 'gray'}
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href;
                const url = window.prompt('URL do Link', previousUrl);
                if (url === null) return;
                if (url === '') {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run();
                  return;
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              }}
            />
          </HStack>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none !important;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--chakra-colors-brand-500);
          padding-left: 1rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          margin: 1.5rem 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }
        .ProseMirror pre {
          background: #0d1117;
          color: #e6edf3;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Fira Code', monospace;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
        
        .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .editor-link {
          color: var(--chakra-colors-brand-400);
          text-decoration: underline;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror td, .ProseMirror th {
          min-width: 1em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: rgba(255, 255, 255, 0.05);
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.1);
          pointer-events: none;
        }
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
      `}</style>
    </Box>
  );
}
