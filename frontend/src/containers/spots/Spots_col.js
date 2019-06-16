import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Item from '../../components/test_card'

const placeinfo = {
	name: "Taipei101",
	type: "FAVORITE",
	staying: "one hour",
	note: "Go to the top of the building... (should be able to edited)",
	photo: "http://images.skyscrapercenter.com/building/tapei101_ext-mainup_(c)taipeifinancial.jpg"
}

class Column extends Component {
	handleDelete = (id, colid) => {
		this.props.handleDelete(id, colid)
	}
	render() {
		let items = null;
		if (this.props.items.length != 0) {
			items = this.props.items.map((item, index) => <Item
				id={item.id} key={item.id} description={item.description}
				index={index} colid={this.props.column.id} place={placeinfo} handleDelete={this.handleDelete}/>);
		}
		return (
			<Droppable droppableId={this.props.column.id}>
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps} style={{minHeight:'10em'}}>
						{items}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		);
	}
}

export default Column;