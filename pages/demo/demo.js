// pages/demo/demo.js
Page({
  
  formSubmit: function(e){
    console.log('form submit with data :', e.detail.value)
  },

  resetForm:function(e){
    console.log('reset')
  }

  
})
