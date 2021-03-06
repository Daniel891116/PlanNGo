import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './../../App.css';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import StarIcon from '@material-ui/icons/Star';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocateIcon from '@material-ui/icons/LocationCity';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Col from './SpotsCol'
import { Element, scrollSpy, Events, Link } from 'react-scroll';
import { DAYS_INFO, ITEM_SUBSCRIPTION, ITEMINFO_SUBSCRIPTION} from '../../graphql'
import { Query, Mutation } from 'react-apollo'
import { listToObjbyID } from '../../util'

const totalTypes = ["droppable-1", "droppable-2", "droppable-3"]

function TabContainer(props) {
  return (
    <Element name="Container" className="element fixed-size" id="ContainerElement">
      <Typography component="div" style={{ padding: 8 }}>
        {props.children}
      </Typography>
    </Element>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


class Spots extends Component {
  constructor(props){
    super(props);
    this.state ={
      value:0
    }
  }
  
  handleChange = (e, newValue) => [
    this.setState({
      value: newValue
    })
  ]
  handleDelete = (id, colid) => {
    this.props.handleDelete(id, colid)
  }

  unsubscribe = null

  render() {
    const userID = this.props.user
    return (<Query query={DAYS_INFO} fetchPolicy='network-only' variables={{userID}} partialRefetch={true}>{
      ({loading, error, data, subscribeToMore}) => {
        if (error) return <div id="middle_spot">error!</div>
        if (loading) return <div id="middle_spot">loading...</div>
        const daysInfo = listToObjbyID(data.users.days)
        console.log("DAYINFO",daysInfo)
        let renderCols = totalTypes.map(colId => {
          const column = daysInfo[colId];
          const items = column.items;
          return (<Col socket={this.props.socket} user={userID} key={column.id} column={column} items={items} handleDelete={this.handleDelete}/>);
        })

        let value = this.state.value;
        if (!this.unsubscribe) {
          this.unsubscribe = [ 
            subscribeToMore({
              document:  ITEM_SUBSCRIPTION,
              variables: { userid: userID, id: userID },
              updateQuery: (prev, { subscriptionData }) => {
               
                if (!subscriptionData.data) return prev
                const newDays = subscriptionData.data.item.data.days;
                const newtotalDays = subscriptionData.data.item.data.totalDays;
                const newfirstDay = subscriptionData.data.item.data.firstDay; 
                // console.log("YAAAAAAAAAAAAAA")            
                prev.users.days = newDays;
                prev.users.totalDays = newtotalDays;
                // prev.users.firstDay = newfirstDay;
                
                return {
                  ...prev,
                  days: newDays,
                  totalDays: newtotalDays,
                  firstDay: newfirstDay
                }
            }}),
        subscribeToMore({
          document: ITEMINFO_SUBSCRIPTION,
          variables: { userid: userID },
          updateQuery: (prev, { subscriptionData }) => {
         
            if (!subscriptionData.data) return prev
            const newItem = subscriptionData.data.iteminfo.data
            
            const updatedays = prev.users.days
            const updatedayindex = updatedays.findIndex(day => {
              return day.items.find(item => {
                return item.id === newItem.id
              })
            })
            const updateitemindex = updatedays[updatedayindex].items.findIndex(item => {
              return item.id === newItem.id
            })
            updatedays[updatedayindex].items[updateitemindex].place = newItem.place
            prev.users.days = updatedays

            return {
              ...prev,
              days: updatedays
            }
          }
      })]
        }
        return(
          <div id="middle_spot">
            {/* <span>
              <Typography variant="h5" gutterBottom style={{marginLeft:'10px', marginTop:'10px'}}>
                Spots
              </Typography>
            </span> */}
            <div>
              {/* <AppBar position="static" color="default"> */}
              <Paper square >
                <Tabs
                  value={value}
                  onChange={this.handleChange}
                  //variant="fullWidth"
                  indicatorColor="secondary"
                  textColor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                  // size="small"
                >
                  <Tab  icon={<RestaurantIcon style={{margin: "9"}}/> } style={{ padding: 4, width:'33%', minWidth: 90, minHeight: 18 }} />
                  <Tab  icon={<StarIcon style={{margin: "9"}}/>} style={{ padding: 4, width:'33%', minWidth: 90, minHeight: 18 }} />
                  <Tab  icon={<LocateIcon style={{margin: "9"}}/>} style={{ padding: 4, width:'33%', minWidth: 90, minHeight: 18 }} />
                </Tabs>
              </Paper>
              {value === 0 && <TabContainer>{renderCols[0]}</TabContainer>}
              {value === 1 && <TabContainer>{renderCols[1]}</TabContainer>}
              {value === 2 && <TabContainer>{renderCols[2]}</TabContainer>}
            </div>
          </div>
        );
      }
    }</Query>);
  }
}

export default Spots;