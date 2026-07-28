from django import forms

class CallbackForm(forms.Form):
  name = forms.CharField(max_length=255)
  phone = forms.CharField(max_length=50)

  product_data = forms.CharField(
      required=False,
      widget=forms.HiddenInput(),
  )
