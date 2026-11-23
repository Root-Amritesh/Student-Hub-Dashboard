# Before you upload — final checklist

The report and ZIP are generated and validated. Section and enrollment numbers are filled. Only **dates and signatures** are left.

## 1. Fill these in `UniDesk_Student_Hub_Project_Report.docx`

Search for `[FILL` and replace every occurrence:

| Location | What to enter |
| --- | --- |
| Certificate | Dates and signatures for the four members and the guide |
| Declaration | Dates and signatures for the four members |

Section is already filled as **B-27 S-14**.

Enrollment numbers are already filled:

| Member | Enrollment No. |
| --- | --- |
| Amritesh Kumar (Team Leader) | S26CSEU0943 |
| Naved Ali | S26CSEU0955 |
| Aryan Chahal | S26CSEU0930 |
| Tanishk Singh | S26CSEU0934 |

Then regenerate the PDF from the edited DOCX:

```powershell
& 'C:\Users\Amritesh\AppData\Local\Temp\opencode\docx_to_pdf.ps1' `
  -Docx 'D:\01_User\Documents\Default Project\submission\UniDesk_Student_Hub_Project_Report.docx' `
  -Pdf  'D:\01_User\Documents\Default Project\submission\UniDesk_Student_Hub_Project_Report.pdf'
```

> If that helper script is no longer present, open the DOCX in Word → File → Save As → PDF.

## 2. Files to upload on LMS (each of the four students uploads both)

- `UniDesk_StudentHub_2026FSWD100.zip` — 23 entries, integrity verified, all assets local.
- `UniDesk_Student_Hub_Project_Report.pdf` — black-and-white report with all six screenshots and no footer/appendix clutter.

## 3. LMS text box

Paste exactly:

```
UniDesk Student Hub - A Zero-Dependency Responsive Study Workspace
```

## 4. Sanity checks already completed

- `index.html` opens with relative asset paths; no CDN or build step.
- ZIP contains the local SVG logo and three MP3 loops.
- 21-period real Bennett timetable; Tuesday rollover verified.
- Zero console errors; Lighthouse 100/100/100.
- No `innerHTML` with user data; browser storage keys are namespaced.

## 5. Viva tip

Keep the Focus module playing while switching sections — it proves hash navigation does not reload the page. The report's Section 4 and Section 7 contain the algorithms and quality results to quote.
