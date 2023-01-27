# mini-multi-slider
Multi slider component for Mini Program applications.

![Screenshot of a multi slider component](/screenshot.PNG "A multi slider component")

# Installation
```
npm install mini-multi-slider --save
```

# Setup
Include the component in your page's configuration file under the `usingComponents` property. Example:
```
"usingComponents": {
    ...
    "mini-multi-slider": "mini-multi-slider/index",
    ...
  }
```

# Usage
Add the component tag in your page using the tag name chosen during setup. Example:
```
<mini-multi-slider 
  sliderWidth="700" //Value in rpx, example: 700rpx
  from={{fromVal}} //range start number
  to={{toVal}} //range end number
  sliderColor={{sliderColor}} //Color name or hex color
  selectedColor={{selectedColor}} //Color name or hex color
  buttonSize={{buttonSize}} //Value in pixels
  onChangeValue="handleChangeValue" //Receives updated 'from' and 'to' values.
  onTouchMove="handleTouchMove" //This callback fires whenever a move happens
  onTouchCancel="handleTouchCancel" //This callback fires when touch move is cancelled.></mini-multi-slider>
```
The `callback` function `onChangeValue` gets passed the updated `from` and `to` variables, respectively. And this callback can use the new values to set the state and update page view. Example:
```
handleChangeValue(fromVal, toVal){
  this.setData({fromVal, toVal});
}
```
