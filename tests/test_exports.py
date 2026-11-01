import unittest, tempfile, subprocess
from pathlib import Path
from io import BytesIO
from openpyxl import load_workbook
from docx import Document
from exports import workbook, docx, pdf
from test_engine import BASE

class ExportTests(unittest.TestCase):
 def setUp(self): self.data=dict(BASE,name='Illustrative case',currency='USD',role='CFO')
 def test_workbook_formulas_and_inputs(self):
  book=load_workbook(BytesIO(workbook(self.data)),data_only=False); self.assertEqual(book.sheetnames,['Scenarios','Inputs','Evidence','Sensitivity']); self.assertEqual(book['Inputs']['B2'].value,420000); self.assertEqual(book['Inputs']['B11'].value,160); self.assertIn('Inputs!B17',book['Scenarios']['D3'].value);self.assertIn('Inputs!B8',book['Scenarios']['K3'].value);self.assertEqual(book['Scenarios']['B3'].value,'=IF(ISNUMBER(Inputs!B11),Inputs!B11,"")')
 def test_incomplete_input_not_zero(self):
  book=load_workbook(BytesIO(workbook(dict(self.data,current='')))); self.assertIsNone(book['Inputs']['B2'].value)
 def test_word_content(self):
  doc=Document(BytesIO(docx(self.data))); text='\n'.join(p.text for p in doc.paragraphs);self.assertIn('65,000.00',text);self.assertIn('Assumptions and open questions',text);self.assertIn('PRICE-02',text);self.assertIn('Scenarios and sensitivity',text)
 def test_pdf_text(self):
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'report.pdf';path.write_bytes(pdf(self.data)); text=subprocess.check_output(['pdftotext',str(path),'-'],text=True);self.assertIn('65,000.00',text);self.assertIn('Financial comparison',text);self.assertIn('PRICE-02',text);self.assertIn('Scenarios and sensitivity',text)
