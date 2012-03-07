---
layout: post
title: "Fix: Emacs/Aquamacs keeps adding encoding comments to my files"
category:
tags: []
---
{% include JB/setup %}
ruby, ruby-mode, emacs, editor, AquamacsI had a problem, when I had files of weird encodings or unknown encodings emacs would add a stupid comment at the top  # -*- coding: " coding-system " -*- where coding-system was the detected encoding, such as # -*- coding: utf-8 -*-

I found this a big problem because it would add it to my erb files, which in turn would actually display the comment on the HTML, because # isn't a valid html comment... Actually that it was trying to comment it was a hint of where this was occurring so I could disable it.

It turns out it was ruby-mode for emacs that was adding this stupid comment 'on my behalf' against my wishes...

So now that I knew what was causing it, it was time to fix the problem.

Just edit the ruby-mode emacs file, force it to recompile and use emacs without it screwing up your files...

On my system the files was here, but it will be in your emacs folder wherever you keep it.
`emacs /Users/danmayer/.emacs.d/elpa/ruby-mode-1.1/ruby-mode.el`

Then comment out this code (note that ;; is a comment for lisp):
;; (defun ruby-mode-set-encoding ()
;;   "Insert a magic comment header with the proper encoding if necessary."
;;   (save-excursion
;;     (widen)
;;     (goto-char (point-min))
;;     (when (re-search-forward "[^\0-\177]" nil t)
;;       (goto-char (point-min))
;;       (let ((coding-system
;;              (or coding-system-for-write
;;                  buffer-file-coding-system)))
;;         (if coding-system
;;             (setq coding-system
;;                   (or (coding-system-get coding-system 'mime-charset)
;;                       (coding-system-change-eol-conversion coding-system nil))))
;;         (setq coding-system
;;               (if coding-system
;;                   (symbol-name
;;                    (or (and ruby-use-encoding-map
;;                             (cdr (assq coding-system ruby-encoding-map)))
;;                        coding-system))
;;                 "ascii-8bit"))
;;         (if (looking-at "^#![^\n]*ruby") (beginning-of-line 2))
;;         (cond ((looking-at "\\s *#.*-\*-\\s *\\(en\\)?coding\\s *:\\s *\\([-a-z0-9_]*\\)\\s *\\(;\\|-\*-\\)")
;;                (unless (string= (match-string 2) coding-system)
;;                  (goto-char (match-beginning 2))
;;                  (delete-region (point) (match-end 2))
;;                  (and (looking-at "-\*-")
;;                       (let ((n (skip-chars-backward " ")))
;;                         (cond ((= n 0) (insert "  ") (backward-char))
;;                               ((= n -1) (insert " "))
;;                               ((forward-char)))))
;;                  (insert coding-system)))
;;               ((looking-at "\\s *#.*coding\\s *[:=]"))
;;               (t (when ruby-insert-encoding-magic-comment
;;                    (insert "# -*- coding: " coding-system " -*-\n")))
;;               )))))

;;  (add-hook
;;    (cond ((boundp 'before-save-hook)
;;           (make-local-variable 'before-save-hook)
;;           'before-save-hook)
;;          ((boundp 'write-contents-functions) 'write-contents-functions)
;;          ((boundp 'write-contents-hooks) 'write-contents-hooks))
;;    'ruby-mode-set-encoding)

Finally, delete the compiled file forcing it to recompile the plugin next time emacs is opened... on my system:
`rm /Users/danmayer/.emacs.d/elpa/ruby-mode-1.1/ruby-mode.elc`

That's it, no more encoding comments in your files... The rest of ruby-mode continues to work, and you will have less urges to throw your computer out of the window.

Don't worry, I still like you pretty well emacs, although it seems the whole world is moving to Vim, and if Textmate-2 is ever released, your cryptic ways may come to an end. Yes you can do anything, but I can't make you always do what I want.