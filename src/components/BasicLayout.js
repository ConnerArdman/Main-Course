/*
  Hari Kaushik , Sai Ranganathan
  This is the basic layout component which contains all the structural formatting for the entire
  app. It imports external libraries such as ant design, bootstrap and moment in order to stye the
  entire structure of the application. It creates and instantiates all the other objects and renders
  it onto this component.
*/

import React, { Component } from 'react';
import { Layout, Button, Popconfirm, Popover} from 'antd';
import Scheduler from './Scheduler';
import GroceryList from './GroceryList';
import About from './About';
import 'antd/dist/antd.css';
import '../bootstrap.css';
import '../App.css';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
const { Sider, Header, Content } = Layout;

class BasicLayout extends Component {
  constructor(props){
    super(props);
    // the state class for the collapsed referring to the side bar
    this.state = {
      collapsed: false,
      broken: false
    };
  }

  // sets the state of the collapsed variable to having the attribute of
  // being collapsed down.
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  // clears the local stoarage and then reloads it when the cache needs to be emptied.
  emptyCache = () => {
    window.localStorage.clear();
    window.location.reload();
  }

  onBreakpoint = (broken) => {
    this.setState({ broken });
  }

  aboutNav = () =>  {
    this.setState({nav: 'about'});
  }

  homeNav = () => {
    this.setState({nav: 'main'});
  }

  renderRoute = () =>  {
    if(this.state.nav === 'about') {
      return (
        <Redirect to='/about'/>
      );
    } else {
      return (
        <Redirect to='/'/>
      );
    }
  }

  renderContent = () => {
    if(this.props.content === "about"){
      return(
        <About
          currentDate={this.props.currentDate}
          setDate={this.props.setDate}
          schedule={this.props.schedule}
          updateSchedule={this.props.updateSchedule}
        />
      );
    } else {
      return(
        <Scheduler
          currentDate={this.props.currentDate}
          setDate={this.props.setDate}
          schedule={this.props.schedule}
          updateSchedule={this.props.updateSchedule}
          broken={this.state.broken}
        />
      );
    }
  }
  // function renders and returns the layout of the app while instantiating
  // items within the structure.
  render() {
    if(this.state.nav && this.state.nav != this.props.content) {
      return(
        this.renderRoute()
      );
    }
    return (
      <Layout className="basicLayout">
        <Sider
          defaultCollapsed
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          breakpoint='lg'
          className="sider"
          width={this.state.broken ? "100%" : "20%"}
          onBreakpoint={this.onBreakpoint}
        >
          <div onClick={this.homeNav} className={this.state.collapsed ? "hidden" : "pageTitle"}>
            <h1 className="title">Main Course</h1>
          </div>
          <div className="sideButtons">
            <Popover placement='right' content={<GroceryList />} trigger="click" title="My Grocery List">
              <Button className={this.state.collapsed ? "hidden" : "groceryBtn"} type="primary">
                <span>Grocery List</span>
              </Button>
            </Popover>
            <Popconfirm placement='right' title="Are you sure you want to clear the schedule?" onConfirm={this.emptyCache} okText="Yes" cancelText="No">
              <Button className={this.state.collapsed ? "hidden" : "clearAll"} type="primary">
                Clear schedule
              </Button>
            </Popconfirm>
            <div>
            </div>
            <Button className={this.state.collapsed ? "hidden" : "clearAll"} onClick={() => {
                  if (this.props.location.pathname === '/about') {
                     this.homeNav();
                  } else {
                     this.aboutNav();
                  }
               }} type="primary">
               {this.props.location.pathname === '/about' ? 'Calendar' : 'About Us'}
             </Button>
             <Popconfirm placement='right' title="Are you sure you want to log out?" onConfirm={this.props.logOut} okText="Yes" cancelText="No">
                <Button className={this.state.collapsed ? "hidden" : "clearAll"} type="primary">
                   Log Out
                </Button>
             </Popconfirm>
          </div>
        </Sider>
        <Layout className={this.state.collapsed ? "main main-grow" : "main"}>
          <Header className="header">
            <h2 className="currentDay">
              {this.props.currentDate.format("MMMM Do, YYYY")}
            </h2>
          </Header>
          <Content className="mainContent" >
            {this.renderContent()}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
