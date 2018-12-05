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
import 'antd/dist/antd.css';
import '../bootstrap.css';
import '../App.css';
import moment from 'moment';
const { Sider, Header, Content } = Layout;

class BasicLayout extends Component {
  constructor(props){
    super(props);
    // the state class for the collapsed referring to the side bar
    this.state = {
      collapsed: false,
      broken: false,
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

  // function renders and returns the layout of the app while instantiating
  // items within the structure.
  render() {
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
          <div className={this.state.collapsed ? "hidden" : "pageTitle"}>
            <h1 className="title">Main Course</h1>
          </div>
          <div className="sideButtons">
            <Popover placement='right' content={<GroceryList />} trigger="click" title="My Grocery List">
              <Button className={this.state.collapsed ? "hidden" : "groceryBtn"} type="primary">
                <span>Grocery List</span>
              </Button>
            </Popover>
            <Popconfirm placement='right' title="Are you sure you want to clear the cache?" onConfirm={this.emptyCache} okText="Yes" cancelText="No">
              <Button className={this.state.collapsed ? "hidden" : "clearAll"} type="primary">
                Clear schedule
              </Button>
            </Popconfirm>
            <Button className={this.state.collapsed ? "hidden" : "logoutBtn"} type="primary">
                <span>Logout</span>
            </Button>
          </div>
        </Sider>
        <Layout className={this.state.collapsed ? "main main-grow" : "main"}>
          <Header className="header">
            <h2 className="currentDay">
              {this.props.currentDate.format("MMMM Do, YYYY")}
            </h2>
          </Header>
          <Content className="mainContent" >
            <Scheduler
              currentDate={this.props.currentDate}
              setDate={this.props.setDate}
              schedule={this.props.schedule}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
