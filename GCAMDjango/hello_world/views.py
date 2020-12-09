from django.shortcuts import render
from django.http import HttpResponse
from pydicom import dcmread
from pydicom.data import get_testdata_file

# Create your views here.


# def hello_world(request):
#     return render(request, 'hello_world.html', {})
def home(request):
    # return HttpResponse("<h1>hello world</h1>")
    return render(request, 'home.html', {'name': 'Bang'})


def readImage(request):
    ct_filename = get_testdata_file("CT_small.dcm")
    ds = dcmread(ct_filename)
    print(ds)
    return render(request, "result.html", {'result': ds})


def aclick(request):
    # return HttpResponse("<h1>hello world</h1>")
    return render(request, 'a.html', {'name': 'Bang'})
