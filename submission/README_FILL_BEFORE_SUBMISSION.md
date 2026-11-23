# Before you upload — final checklist

Everything is generated and validated. **Only four pieces of information are missing**, and they must be filled in the report before upload.

## 1. Fill these in `UniDesk_Student_Hub_Project_Report.docx`

Search for `[FILL` and replace every occurrence:

| Location | What to enter |
| --- | --- |
| Cover page | Your **section** |
| Cover page | **Four enrollment numbers** |
| Certificate table | Enrollment numbers, dates and signatures for all four members and the guide |
| Declaration table | Enrollment numbers and dates for all four members |
| Team Leader | Confirm the name (currently **Amritesh Kumar**) |

Then regenerate the PDF from the edited DOCX:

```powershell
& 'C:\Users\Amritesh\AppData\Local\Temp\opencode\docx_to_pdf.ps1' `
  -Docx 'D:\01_User\Documents\Default Project\submission\UniDesk_Student_Hub_Project_Report.docx' `
  -Pdf  'D:\01_User\Documents\Default Project\submission\UniDesk_Student_Hub_Project_Report.pdf'
```

> If that helper script is no longer present, open the DOCX in Word → File → Save As → PDF.

## 2. Files to upload on LMS (each of the four students uploads both)

- `UniDesk_StudentHub_2026FSWD100.zip` — 23 entries, integrity verified, all assets local.
- `UniDesk_Student_Hub_Project_Report.pdf` — 23 pages, includes certificate, declaration, all 7 rubric areas, 6 screenshots, testing results, individual contributions and viva Q&A.

## 3. LMS text box

Paste exactly:

```
UniDesk Student Hub - A Zero-Dependency Responsive Study Workspace
```

## 4. Sanity checks already completed

- `index.html` opens with relative asset paths; no CDN or build step.
- ZIP contains local SVG logo and three MP3 loops.
- 21-period real Bennett timetable; Tuesday rollover verified.
- Zero console errors; Lighthouse 100/100/100.
- No `innerHTML` with user data; no `toISOString().slice(0,10)`.

## 5. Viva tip

Keep the Focus module playing while switching sections — it proves hash navigation does not reload the page. Use `docs/VIVA_PREP.md` and Appendix C of the report for model answers.
