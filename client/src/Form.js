import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component{

    state = {
        text: '',
    }

    handleChange= (e) => {
        const newText = e.target.value;
        this.setState({
            text: newText
        })
    };

    handleKeyDown = (e) => {
        if(e.keyCode === 13){
            this.props.submit(this.state.text);
            this.setState({text:""});

        }
    };

    render(){
        const {text} = this.state;
        return(
            <TextField
          label="todo..."
          margin="normal"
          onChange= {(this.handleChange)}
          onKeyDown={this.handleKeyDown}
          value={text}
          fullWidth
        />
        );
    }
}