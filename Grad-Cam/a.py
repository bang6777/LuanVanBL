import matplotlib.pyplot as plt
import pydicom
from pydicom.data import get_testdata_files
# from pydicom.GDCM

print(__doc__)
base = "./dcm"
pass_dicom = "t1.dcm"
# pass_dicom = "IM-0001-0001.dcm"
# pass_dicom = "MR000000"
# filename = pydicom.data.data_manager.get_files(base, pass_dicom)[0]
filename = pydicom.data.data_manager.get_files(base, pass_dicom)[0]
# filename = get_testdata_files('CT_small.dcm')[0]
dataset = pydicom.dcmread(filename)

# Normal mode:
print()
print("Filename.........:", filename)
print("Storage type.....:", dataset.SOPClassUID)
print()

# pat_name = dataset.PatientName
# display_name = pat_name.family_name + ", " + pat_name.given_name
# print("Patient's name...:", display_name)
# print("Patient id.......:", dataset.PatientID)
# print("Modality.........:", dataset.Modality)
# print("Study Date.......:", dataset.StudyDate)

if 'PixelData' in dataset:
    rows = int(dataset.Rows)
    cols = int(dataset.Columns)
    print("Image size.......: {rows:d} x {cols:d}, {size:d} bytes".format(
        rows=rows, cols=cols, size=len(dataset.PixelData)))
    if 'PixelSpacing' in dataset:
        print("Pixel spacing....:", dataset.PixelSpacing)

# use .get() if not sure the item exists, and want a default value if missing
print("Slice location...:", dataset.get('SliceLocation', "(missing)"))

# plot the image using matplotlib
plt.imshow(dataset.pixel_array, cmap=plt.cm.bone)
plt.show()
