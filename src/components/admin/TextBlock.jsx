'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Box,
  IconButton,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  IconBold,
  IconItalic,
  IconH2,
  IconH3,
  IconH4,
  IconList,
  IconListNumbers,
  IconQuote,
  IconLink,
  IconUnlink,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';

export default function TextBlock({ content, onChange }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4], // Exclude H1 (reserved for public article title)
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });


  // Sync editor content if updated externally (like when loading initial data in edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // Formatting actions
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleH4 = () => editor.chain().focus().toggleHeading({ level: 4 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const handleUndo = () => editor.chain().focus().undo().run();
  const handleRedo = () => editor.chain().focus().redo().run();

  // Link Dialog handlers
  const handleLinkClick = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setLinkDialogOpen(true);
  };

  const handleAddLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setLinkDialogOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkDialogOpen(false);
  };

  return (
    <Box sx={{ border: '1px solid #DFE5EF', borderRadius: '6px', overflow: 'hidden' }}>
      {/* Editor Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #DFE5EF',
          alignItems: 'center',
        }}
      >
        <ButtonGroup size="small" variant="text">
          <IconButton
            size="small"
            onClick={toggleBold}
            color={editor.isActive('bold') ? 'primary' : 'default'}
            title="Bold"
          >
            <IconBold size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleItalic}
            color={editor.isActive('italic') ? 'primary' : 'default'}
            title="Italic"
          >
            <IconItalic size={18} />
          </IconButton>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup size="small" variant="text">
          <IconButton
            size="small"
            onClick={toggleH2}
            color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
            title="Heading 2 (H2)"
          >
            <IconH2 size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleH3}
            color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
            title="Heading 3 (H3)"
          >
            <IconH3 size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleH4}
            color={editor.isActive('heading', { level: 4 }) ? 'primary' : 'default'}
            title="Heading 4 (H4)"
          >
            <IconH4 size={18} />
          </IconButton>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup size="small" variant="text">
          <IconButton
            size="small"
            onClick={toggleBulletList}
            color={editor.isActive('bulletList') ? 'primary' : 'default'}
            title="Bullet List"
          >
            <IconList size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleOrderedList}
            color={editor.isActive('orderedList') ? 'primary' : 'default'}
            title="Numbered List"
          >
            <IconListNumbers size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleBlockquote}
            color={editor.isActive('blockquote') ? 'primary' : 'default'}
            title="Blockquote"
          >
            <IconQuote size={18} />
          </IconButton>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup size="small" variant="text">
          <IconButton
            size="small"
            onClick={handleLinkClick}
            color={editor.isActive('link') ? 'primary' : 'default'}
            title="Insert Link"
          >
            <IconLink size={18} />
          </IconButton>
          {editor.isActive('link') && (
            <IconButton size="small" onClick={handleRemoveLink} title="Remove Link" color="error">
              <IconUnlink size={18} />
            </IconButton>
          )}
        </ButtonGroup>

        <Box sx={{ flexGrow: 1 }} />

        <ButtonGroup size="small" variant="text">
          <IconButton size="small" onClick={handleUndo} title="Undo">
            <IconArrowBackUp size={18} />
          </IconButton>
          <IconButton size="small" onClick={handleRedo} title="Redo">
            <IconArrowForwardUp size={18} />
          </IconButton>
        </ButtonGroup>
      </Box>

      {/* Editor Content Area */}
      <Box
        sx={{
          p: 2,
          minHeight: '150px',
          backgroundColor: '#ffffff',
          cursor: 'text',
          '& .ProseMirror': {
            outline: 'none',
            minHeight: '150px',
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#2A3547',
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              color: '#adb5bd',
              pointerEvents: 'none',
              height: 0,
            },
            '& h2': { fontSize: '20px', fontWeight: 600, mt: 1.5, mb: 1, color: '#111' },
            '& h3': { fontSize: '18px', fontWeight: 600, mt: 1.2, mb: 0.8, color: '#222' },
            '& h4': { fontSize: '16px', fontWeight: 600, mt: 1, mb: 0.5, color: '#333' },
            '& ul': { pl: 3, mb: 1, listStyleType: 'disc' },
            '& ol': { pl: 3, mb: 1, listStyleType: 'decimal' },
            '& blockquote': {
              borderLeft: '4px solid #1A4FD6',
              pl: 2,
              py: 0.5,
              my: 1,
              fontStyle: 'italic',
              backgroundColor: '#F8FAFC',
              color: '#5A6A85',
            },
            '& a': {
              color: '#1A4FD6',
              textDecoration: 'underline',
            },
          },
        }}
        onClick={() => editor.chain().focus().run()}
      >
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                p: 0.75,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                zIndex: 9999,
              }}
            >
              <IconButton
                size="small"
                onClick={toggleBold}
                sx={{
                  color: editor.isActive('bold') ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Bold"
              >
                <IconBold size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleItalic}
                sx={{
                  color: editor.isActive('italic') ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Italic"
              >
                <IconItalic size={16} />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ my: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' }} />

              <IconButton
                size="small"
                onClick={toggleH2}
                sx={{
                  color: editor.isActive('heading', { level: 2 }) ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Heading 2"
              >
                <IconH2 size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleH3}
                sx={{
                  color: editor.isActive('heading', { level: 3 }) ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Heading 3"
              >
                <IconH3 size={16} />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ my: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' }} />

              <IconButton
                size="small"
                onClick={toggleBulletList}
                sx={{
                  color: editor.isActive('bulletList') ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Bullet List"
              >
                <IconList size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleBlockquote}
                sx={{
                  color: editor.isActive('blockquote') ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Blockquote"
              >
                <IconQuote size={16} />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ my: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' }} />

              <IconButton
                size="small"
                onClick={handleLinkClick}
                sx={{
                  color: editor.isActive('link') ? '#1A4FD6' : '#ffffff',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
                title="Insert Link"
              >
                <IconLink size={16} />
              </IconButton>
              {editor.isActive('link') && (
                <IconButton
                  size="small"
                  onClick={handleRemoveLink}
                  sx={{
                    color: '#ef4444',
                    p: 0.5,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                  }}
                  title="Remove Link"
                >
                  <IconUnlink size={16} />
                </IconButton>
              )}
            </Box>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </Box>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Hyperlink</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL Address"
            type="url"
            fullWidth
            variant="outlined"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setLinkDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddLink} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
