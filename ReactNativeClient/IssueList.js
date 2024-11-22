import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://192.168.10.122:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.filterContainer}>
          <Text>Status:</Text>
          <TextInput placeholder="Enter status" style={styles.input} />
          <Text>Owner:</Text>
          <TextInput placeholder="Enter owner" style={styles.input} />
          <Button title="Filter" onPress={() => {}} />
        </View>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { flexDirection: 'row', height: 50, backgroundColor: '#537791' },
  headerCell: { textAlign: 'center', fontWeight: 'bold', color: '#fff', padding: 5 },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: 'row', height: 40, backgroundColor: '#E7E6E1' },
  cell: { textAlign: 'center', padding: 5 },
  tableContainer: { marginBottom: 30 },
});

const width = [40, 60, 60, 65, 65, 50, 50];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = [
      issue.id,
      issue.status,
      issue.owner,
      issue.created.toDateString(),
      issue.effort,
      issue.due ? issue.due.toDateString() : '',
      issue.title
  ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <View style={styles.row}>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
        {rowData.map((data, index) => (
            <Text key={index} style={[styles.cell, { width: width[index] }]}>{data}</Text>
        ))}
      {/****** Q2: Coding Ends here. ******/}  
      </View>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = Array.isArray(props.issues) ? props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    ) : [];

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = (
      <View style={styles.header}>
          {['ID', 'Status', 'Owner', 'Created', 'Effort', 'Due', 'Title'].map((header, index) => (
               <Text key={index} style={[styles.headerCell, { width: width[index] }]}>{header}</Text>
          ))}
      </View>
  );
  {/****** Q2: Coding Ends here. ******/}
  
  return (
    <View style={styles.tableContainer}>
  {/****** Q2: Start Coding here to render the table header/rows.**********/}
      {tableHeader}
      <View style={styles.dataWrapper}>
          {issueRows}
      </View>
  {/****** Q2: Coding Ends here. ******/}
  </View>
  );
}

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
        status: '',
        owner: '',
        effort: '',
        title: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Code Ends here. ******/
    
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    this.handleChange = this.handleChange.bind(this);
    }

    handleChange(field, value) {
        this.setState({ [field]: value });
    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { status, owner, effort, title } = this.state;
        const newIssue = {
            status,
            owner,
            effort: parseInt(effort, 10),
            title,
            created: new Date(),
        };
        this.props.createIssue(newIssue);
        this.setState({
            status: '',
            owner: '',
            effort: '',
            title: '',
        });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
        <View style={styles.formContainer}>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
                    placeholder="Status"
                    value={this.state.status}
                    onChangeText={(text) => this.handleChange('status', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Owner"
                    value={this.state.owner}
                    onChangeText={(text) => this.handleChange('owner', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Effort"
                    value={this.state.effort}
                    onChangeText={(text) => this.handleChange('effort', text)}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Title"
                    value={this.state.title}
                    onChangeText={(text) => this.handleChange('title', text)}
                    style={styles.input}
                />
                <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name:" "}
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newname){

        this.setState({name: newname});
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {

    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query  = `mutation myaddToBlackList($newname: String!){
        addToBlackList(nameInput: $newname)
    }`;
    const newname = this.state.name;
    console.log(newname);
    const data = await graphQLFetch(query, {newname});
    this.newnameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput ref={input => { this.newnameInput = input }} placeholder="Name to Blacklist" onChangeText={newname => this.setName(newname)} />
        <Button onPress={this.handleSubmit} title="Add to BlackList" />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
          id
          title
          status
          owner
          created
          effort
          due
      }
  }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter />
    {/****** Q1: Code ends here ******/}



    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.props.issues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue} />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList />
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
