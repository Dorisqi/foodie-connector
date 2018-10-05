import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import RestaurantFilter from '../../components/RestaurantFilter/RestaurantFilter';
import apiList from '../../apiList';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import AddressSearchBar from '../../components/RestaurantFilter/AddressSearchBar';

const tags = [
  {
      "id": 1,
      "name": "Pizza"
  },
  {
      "id": 2,
      "name": "Japanese"
  }
]
const mockRestaurantList = [
  {
      "id": 2,
      "name": "Heisei Japanese Restaurant",
      "order_minimum": "25",
      "delivery_fee": "3.99",
      "rating": "4.9",
      "address": {
          "id": 2,
          "name": "Heisei Japanese Restaurant",
          "phone": "765432234",
          "line_1": "907 Sagamore Pkwy W",
          "line_2": null,
          "city": "West Lafayette",
          "state": "IN",
          "zip_code": "47906",
          "place_id": "ChIJKyr9T2r9EogRMUn4njQf-H8",
          "lat": "40.4519488",
          "lng": "-86.9195979"
      },
      "categories": [
          "Japanese"
      ],
      "distance": 2.1,
      "estimated_delivery_time": 26
  },
  {
      "id": 1,
      "name": "HotBox Pizza",
      "order_minimum": "10",
      "delivery_fee": "2.99",
      "rating": "4.8",
      "address": {
          "id": 1,
          "name": "HotBox Pizza",
          "phone": "765567765",
          "line_1": "135 S Chauncey Ave",
          "line_2": null,
          "city": "West Lafayette",
          "state": " IN",
          "zip_code": "47906",
          "place_id": "ChIJ6SGX2a7iEogRPb45KHbDAUI",
          "lat": "40.423593",
          "lng": "-86.9080874"
      },
      "categories": [
          "Pizza"
      ],
      "distance": 0.1,
      "estimated_delivery_time": 20
  }
];

const styles = theme =>({
  paper: {
    marginTop: theme.spacing.unit *1,
    display: 'flex',
    flexDirection: 'column',

  },

});
/*
{
            "id": 2,
            "name": "Heisei Japanese Restaurant",
            "order_minimum": "25",
            "delivery_fee": "3.99",
            "rating": "4.9",
            "address": {
                "id": 2,
                "name": "Heisei Japanese Restaurant",
                "phone": "765432234",
                "line_1": "907 Sagamore Pkwy W",
                "line_2": null,
                "city": "West Lafayette",
                "state": "IN",
                "zip_code": "47906",
                "place_id": "ChIJKyr9T2r9EogRMUn4njQf-H8",
                "lat": "40.4519488",
                "lng": "-86.9195979"
            },
            "categories": [
                "Japanese"
            ],
            "distance": 2.1,
            "estimated_delivery_time": 26
        }
*/
class RestaurantListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      tags: [],
      originalList: [],
      changedList: [],
      nameMatchList: [],
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillMount() {
    this.loadList();
  }

  loadList() {
    //TODO load restaurants nearby
    this.setState({
      tags: tags.map(t => t.name),
      originalList: mockRestaurantList,
      changedList: mockRestaurantList,
      nameMatchList: mockRestaurantList,
    });
  }

  handleNameChange(name) {
    const { changedList } = this.state;
    console.log(name);
    this.setState({
      nameMatchList: changedList.filter(item => item.name.toLowerCase().indexOf(name) != -1)
    })
  }

  handleSubmit(place_id) {
    axios.get(apiList.restaurants, {
      params: {
        place_id: place_id
      }
    })
    .then(res => {
      if (res.data) {
        this.setState({
          tags: res.data.categories.map(t => t.name),
          originalList: res.data.restaurants.slice(),
          changedList: res.data.restaurants.slice(),
          mockRestaurantList: res.data.restaurants.slice(),
        });
      }
      else {
        console.log(res);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleFilterChange(selectedTags) {
    const { originalList } = this.state;
    this.setState({
      changedList: originalList.filter(item => item.categories.some(t => selectedTags.includes(t))),
    });
  }

  handleSortChange(sortOrder) {
    const { changedList } = this.state;
    this.setState({
      changedList: changedList.sort((o1, o2) => sortOrder(o1, o2)),
    });
  }

  render() {
    const { nameMatchList, tags } = this.state;
    const { classes } = this.props;
    return (

        <div className={classes.paper}>
        <AddressSearchBar></AddressSearchBar>
          <RestaurantFilter
            onSubmit={this.handleSubmit}
            onFilterChange={this.handleFilterChange}
            onSortChange={this.handleSortChange}
            handleNameChange={this.handleNameChange}
            tags={tags}
          />

          <RestaurantList restaurantList={nameMatchList} />
        </div>

    );
  }
}

RestaurantListPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RestaurantListPage);
