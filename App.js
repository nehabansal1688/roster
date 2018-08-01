import React, { Component } from 'react';
import './app.scss';
import $ from 'jquery';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmp: "",
      selectedShiftIndex:-1,
      colorCodes : ["orange","green","yellow","red","blue","purple","voilet"]
    }
    this.handleChange = this.handleChange.bind(this);
    this.renderRoster = this.renderRoster.bind(this);
    this.convertTimeFormat =  this.convertTimeFormat.bind(this);
    this.renderCells = this.renderCells.bind(this);
    this.formatShifts = this.formatShifts.bind(this);
  }

  //get the roster data from server
  componentDidMount() {
     //get data from server using axios
     var self = this;
     axios.get('https://api.myjson.com/bins/12s0yw')
     .then(function(response) {
       self.setState({shifts: response.data})
     })
   }

  //re render roaster as per the selected colleauge
  handleChange(e){
    var name = e.target.value;
    var index  = this.state.shifts.findIndex(emp => emp.name==name);
    this.setState({selectedEmp:name, selectedShiftIndex: index}); 
    var formatedData = this.formatShifts(this.state.shifts[index].shiftDetails);

    var updatedState = Object.assign({},this.state);
    updatedState.shifts[index].shiftDetails = formatedData;
  
    this.renderRoster(); 
  }

  //converts the 24 hour time format to 12 hr and append color code to the cells
  convertTimeFormat(index, item) {
    var value = null
    item.start = item.start ?  parseInt(item.start) : "";
    item.end = item.end ? parseInt(item.end) : "";

    if(item.start == index ){
      value =  item.start> 12 ?  item.start -12 +  "pm"   : item.start + "am" ;
      return(<td className={item.colorCodes}>{value}</td>);
    }else if(item.end == index){
      value =  item.end > 12 ? item.end -12 + "pm" : item.end + "am" ;
      return(<td className={item.colorCodes}>{value}</td>);
    }  else if((index > item.start && index < item.end) || (item.end == "" && index > item.start && item.start !== "")) {
      return (<td className={item.colorCodes}></td>);
    } else if(item.carryOver && item.carryOver == index ) {
      value = item.carryOver > 12 ? item.carryOver -12 + "pm" : item.carryOver + "am" ;
      return(<td className={item.carryOverColor}>{value}</td>);
    } else if(item.carryOver && index < item.carryOver) {
      return(<td className={item.carryOverColor}></td>);
    } else {
      return (<td></td>);
    }
  }

  //render roster cells
  renderCells(item) {
    var self = this;
    var elem = [];
    if(item.start == "" && item.end == "" && item.carryOver == undefined) {
     return (<td className="break" colspan="24">Break</td>) ;
    }
    for(var i=1;i<25;i++) {
      elem.push(self.convertTimeFormat(i, item));
    }
    return elem;
  }

  //renders the weekly roster
  renderRoster() {
    var self = this;
    var selectedShiftIndex  = this.state.selectedShiftIndex;
    if( selectedShiftIndex !== -1) {
      var elem = this.state.shifts[selectedShiftIndex].shiftDetails.map(function(item, index) {
        return (
        <tr key={index} >	
          <td  className="day-name">
              {item.day}
          </td>
          {self.renderCells(item)}
        </tr>
        );
      });
    return elem;
    }
  }

  //format the data before rendering 
  formatShifts(shiftDetails) {
    var self = this;
    var formatedDetails = [];
    var carryOver = null;
    var carryOverColor = null;
    shiftDetails.forEach(function(item,index) {
      item.colorCodes = self.state.colorCodes[index];
      var details =  item;
       if(carryOver !== null) {
         details.carryOver = carryOver;
         details.carryOverColor = carryOverColor;
         carryOver = null;
       }
      if(parseInt(item.start) > parseInt(item.end)) {
        carryOver = details.end;
        carryOverColor = details.colorCodes;
        details.end = "";
      }
      formatedDetails.push(details);
    })

    if(carryOver !== null) {
      formatedDetails.push({"day":"sat","start":"", "end":"","carryOver" :carryOver, "carryOverColor" : carryOverColor})
      carryOver = null;
    }
    return formatedDetails;
  }

  render() {
    var names = [],
        self = this,
        shifts = this.state.shifts,
        optionItems;
    if(shifts) {
      shifts.forEach(function(employee,index){
        names.push(employee.name);
      });
      optionItems =  names.map((name) =>
        <option key={name}>{name}</option>
      );
    }

    return (
      <div>
        <div className="container">
          <div className="row  mb-5">
              <div className="col-sm-4">
              <select value={this.state.selectedEmp} onChange={this.handleChange}>
                    <option key="default">Select Colleague</option>
                    {optionItems}
						  </select>
              </div>
          </div>
          <div className="row  mt-5">
            <div className="col-sm-12">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                      {this.renderRoster()}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
