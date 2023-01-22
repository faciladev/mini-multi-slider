Component({
    data: { 
      sliderWidth: 300,
      rangeWidth: null,
      leftRangeMargin: 0,
      rightRangeMargin: 0,
      sliderSide: "left", //Or right
      startXPos: 0,
      from: null,
      to: null,
      range: null,
      buttonSize: 18,
      sliderColor: 'lightgreen',
      selectedColor: 'green'
    },
    props: {
      sliderWidth: null,
      buttonSize: null,
      from: null,
      to: null,
      sliderColor: null,
      selectedColor: null,
      onFromCallback: null,
      onToCallback: null
    },
    onInit() {
    },
    didMount() {
      
      //Initial input validation
      if(isNaN(this.props.from) || isNaN(this.props.to)){
        throw new Error("'from' or/and 'to' values are not numbers.");
      }
      if(typeof(this.props.onFromCallback) !== "function" || 
        typeof(this.props.onToCallback) !== "function"){
        throw new Error("'onFromCallback' or/and 'onToCallback' values are not functions.");
      }
  
      this.setData({
        sliderWidth: this.props.sliderWidth || this.data.sliderWidth,
        rangeWidth: this.props.sliderWidth || this.data.sliderWidth,
        buttonSize: this.props.buttonSize || this.data.buttonSize,
        from: this.props.from || this.data.from,
        to: this.props.to || this.data.to,
        sliderColor: this.props.sliderColor || this.data.sliderColor,
        selectedColor: this.props.selectedColor || this.data.selectedColor,
      });
    },
    didUpdate() {},
    didUnmount() {},
    methods: {
      onTouchStart(e){
        //set starting button position and button type
        const startXPos = parseInt(e.changedTouches[0].clientX);
        const sliderSide = e.target.dataset.sliderSide;
        this.setData({startXPos, sliderSide});
      },
      onTouchMove(e){
      },
      getTotalRangeWidth(rangeWidth, leftRangeMargin, rightRangeMargin){
        return rangeWidth + leftRangeMargin + rightRangeMargin;
      },
      plusRangeWidth(pixels){
        return this.data.rangeWidth + pixels;
      },
      minusRangeWidth(pixels){
        return this.data.rangeWidth - pixels;
      },
      plusLeftRangeMargin(pixels){
        return this.data.leftRangeMargin + pixels;
      },
      minusLeftRangeMargin(pixels){
        //return absolute value since the value is used as a positive difference
        return Math.abs(this.data.leftRangeMargin - pixels);
      },
      plusRightRangeMargin(pixels){
        return this.data.rightRangeMargin + pixels;
      },
      minusRightRangeMargin(pixels){
        //return absolute value since the value is used as a positive difference
        return Math.abs(this.data.rightRangeMargin - pixels);
      },
      updateRangeValues(rangeWidth, leftRangeMargin, rightRangeMargin){
        const totalRangeWidth = this.getTotalRangeWidth(rangeWidth, leftRangeMargin, rightRangeMargin);
        if(totalRangeWidth === this.data.sliderWidth){
          if(this.data.sliderSide === "left"){
            this.setData({
              rangeWidth,
              leftRangeMargin
            });
          } else if(this.data.sliderSide === "right"){
            this.setData({
              rangeWidth,
              rightRangeMargin
            });
          } else {
            console.error("Shouldn't be reached.");
          }
        } else if(totalRangeWidth > this.data.sliderWidth) {
          if(this.data.sliderSide === "left"){
            this.setData({
              leftRangeMargin: 0,
              rangeWidth: this.data.sliderWidth - rightRangeMargin
            });
          } else if(this.data.sliderSide === "right") {
            this.setData({
              rightRangeMargin: 0,
              rangeWidth: this.data.sliderWidth - leftRangeMargin
            });
          } else {
            console.error("Shouldn't be reached.");
          }
          
        } else {
          console.error("Shouldn't be reached.");
        }
        
      },
      leftBtnMoveRight(pixels){
        const newRangeWidth = this.minusRangeWidth(pixels);
        const newLeftRangeMargin = this.plusLeftRangeMargin(pixels);
        this.updateRangeValues(newRangeWidth, newLeftRangeMargin, this.data.rightRangeMargin);
      },
      leftBtnMoveLeft(pixels){
        const newRangeWidth = this.plusRangeWidth(pixels);
        const newLeftRangeMargin = this.minusLeftRangeMargin(pixels);
        this.updateRangeValues(newRangeWidth, newLeftRangeMargin, this.data.rightRangeMargin);
      },
      rightBtnMoveRight(pixels){
        const newRangeWidth = this.plusRangeWidth(pixels);
        const newRightRangeMargin = this.minusRightRangeMargin(pixels);
        
        this.updateRangeValues(newRangeWidth, this.data.leftRangeMargin, newRightRangeMargin);
      },
      rightBtnMoveLeft(pixels){
        const newRangeWidth = this.minusRangeWidth(pixels);
        const newRightRangeMargin = this.plusRightRangeMargin(pixels);
        this.updateRangeValues(newRangeWidth, this.data.leftRangeMargin, newRightRangeMargin);
      },
      runCallback(which){
        //Calculate range edge values
        const totalRangeSize = this.data.to - this.data.from;
        const leftMargin = this.data.leftRangeMargin;
        const rightMargin = this.data.rightRangeMargin;
        const sliderWidth = this.data.sliderWidth;
        const leftVal = parseInt((leftMargin * totalRangeSize) / sliderWidth) + this.data.from;
        const sliderWidthMinusRightMargin = sliderWidth - rightMargin;
        const rightVal = parseInt((sliderWidthMinusRightMargin * totalRangeSize) / sliderWidth) + this.data.from;
        if(which === "from"){
          this.props.onFromCallback(leftVal);
        } else if(which === "to") {
          this.props.onToCallback(rightVal);
        } else {
          console.error("Shouldn't be reached.");
        }
      },
      onTouchEnd(e){
        const startXPos = this.data.startXPos;
        const endXPos = parseInt(e.changedTouches[0].clientX);
        const sliderSide = this.data.sliderSide;
  
        //Determin move direction for both left and right buttons
        if(sliderSide === "left"){
          if(endXPos > startXPos){
            this.leftBtnMoveRight(endXPos - startXPos);
          } else if(endXPos < startXPos){
            this.leftBtnMoveLeft(startXPos - endXPos);
          } else {
            //Button didn't move so do nothing
          }
          //Update range values
          this.runCallback("from");
        } else if(sliderSide === "right") {
          if(endXPos > startXPos){
            this.rightBtnMoveRight(endXPos - startXPos);
          } else if(endXPos < startXPos){
            this.rightBtnMoveLeft(startXPos - endXPos);
          } else {
            //Button didn't move so do nothing
          }
          this.runCallback("to");
        }
      },
      onTouchCancel(e){
      }
    }
  });
  