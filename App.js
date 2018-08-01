import React, { Component } from 'react';
import './app.scss';
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmp: "",
      selectedShiftIndex:-1,
      colorCodes : ["orange","green","yellow","red","blue","purple","voilet"],
      shifts : [
        {
           "name":"Colleague 1",
           "shiftDetails":[
              {
                 "day":"mon",
                 "start":"7",
                 "end":"11"
              },
              {
                 "day":"tue",
                 "start":"14",
                 "end":"22"
              },
              {
                 "day":"wed",
                 "start":"8",
                 "end":"14"
              },
              {
                 "day":"thrs",
                 "start":"24",
                 "end":"9"
              },
              {
                 "day":"fri",
                 "start":"18",
                 "end":"2"
              }
           ]
        },
        {
           "name":"Colleague 2",
           "shiftDetails":[
              {
                 "day":"mon",
                 "start":"18",
                 "end":"2"
              },
              {
                 "day":"tue",
                 "start":"19",
                 "end":"22"
              },
              {
                 "day":"wed",
                 "start":"6",
                 "end":"10"
              },
              {
                 "day":"thrs",
                 "start":"",
                 "end":""
              },
              {
                 "day":"fri",
                 "start":"18",
                 "end":"2"
              }
           ]
        },{
          "name":"Colleague 3",
          "shiftDetails":[
             {
                "day":"mon",
                "start":"5",
                "end":"11"
             },
             {
                "day":"tue",
                "start":"",
                "end":""
             },
             {
                "day":"wed",
                "start":"21",
                "end":"6"
             },
             {
                "day":"thrs",
                "start":"16",
                "end":"21"
             },
             {
                "day":"fri",
                "start":"3",
                "end":"9"
             }
          ]
       }
     ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.renderRoster = this.renderRoster.bind(this);
    this.convertTimeFormat =  this.convertTimeFormat.bind(this);
    this.renderCells = this.renderCells.bind(this);
    this.formatShifts = this.formatShifts.bind(this);
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
    if(item.start == index ||  (item.start == 12 + index)){
      value =  item.start> 12 ?  item.start -12 +  "pm"  + " (S)" : item.start + "am" + " (S)";
      return(<td className={item.colorCodes}>{value}</td>);
    }else if(item.end == index || (item.end == 12 + index)){
      value =  item.end > 12 ? item.end -12 + "pm" + " (E)": item.end + "am" + " (E)";
      return(<td className={item.colorCodes}>{value}</td>);
    } 

    if(item.carryOver && (item.carryOver == index || (item.carryOver == 12 + index))) {
      value = item.carryOver > 12 ? item.carryOver -12 + "pm" + " (E)": item.carryOver + "am" + " (E)";
      return(<td className={item.carryOverColor}>{value}</td>);
    }
  
      return (<td></td>)
  }

  //render roster cells
  renderCells(item) {
    var self = this;
    var elem = [];
    for(var i=1;i<13;i++) {
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
    var names = [];
    var self = this;
    var shifts = this.state.shifts;

    shifts.forEach(function(employee,index){
      names.push(employee.name);
    });
    var optionItems =  names.map((name) =>
      <option key={name}>{name}</option>
    );
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
