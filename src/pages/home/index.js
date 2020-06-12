
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ListItems (props) {
  const { element } = props;

  console.log("ListItems props")
  console.log(props)
  const description = `Condición: ${element.condition === 'new' ? 'nuevo' : 'usado'} - Precio original: $${element.original_price} - Ciudad: ${element.address.city_name} `;
  const title = `${element.title} - $${element.price}`

  return (<div>
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={element.thumbnail} style={{width: 90, height: 70, marginRight: 10, borderRadius: 0}}/>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
            </Typography>
            <a href={element.permalink} target="_blank"> Link </a>
            {description}
          </React.Fragment>
        }
      />
    </ListItem>
    <Divider variant="inset" component="li" />
    </div>)
      
}

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: "aaa",
      items: [],
      categories: null,
      site: 'MLC',
      value:0
    };
  }

  getCategories () {
    const {site} = this.state;
    let cateogiresList = [];
    fetch(`https://api.mercadolibre.com/sites/${site}/categories`)
    .then(result=>result.json())
    .then(categories=> {

      categories.forEach(cat => {
        const url = `https://api.mercadolibre.com/sites/${site}/search?category=${cat.id}&shipping=free&discount=40-100`;
        
        fetch(url)
        .then(result=>result.json())
        .then(listItems=>{
          const categorieobj = {
            category: cat,
            items: listItems.results || []
          }

          if(listItems && listItems.results.length > 0 )
            cateogiresList.push(categorieobj);

            this.setState({
              categories: cateogiresList
          })
        }) 
      });
    })
  }

  getItems () {
    const {site, categories} = this.state; 
    debugger;
    let listItemsNews = [];
    categories.forEach(cat => {
      const url = `https://api.mercadolibre.com/sites/${site}/search?category=${cat.id}&shipping=free&discount=40-100`;
      console.log('url --> ')
      console.log(url)

      fetch(url)
      .then(result=>result.json())
      .then(listItems=>{
        const categorieobj = {
          category: cat,
          items: listItems.results || []
        }
        console.log('forEach listItems');
        console.log(listItems);

         listItemsNews.push(categorieobj);

         this.setState({
            items: listItemsNews
          })
      })
    })

  }

  componentDidMount() {
    this.getCategories();
  }

  render() {

    const {categories, value } = this.state;
    console.log("categories ----> ");
    console.log(categories);

    const handleChange = (event, newValue) => {
      this.setState({value:newValue })
    };

    const renderCategories = categories && categories.length > 0 ? categories.map(function(item, index) {
      return <Tab label={item.category.name} {...a11yProps(index)} />;
    }) : [];

    const renderCategoriesTabAndItems = categories && categories.length > 0 ? categories.map(function(item, index) {
      return <TabPanel value={value} index={index}>
                
                <List>
                  {item.items && item.items.length > 0 ? item.items.map(function(element, i) {
                      return <ListItems element={element} index={i} />;
                    }): 'No hay elementos'}
                    
                </List>
              </TabPanel>;
    }) : [];

    return (
      <div className="modal-upseeling">

        <div>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
            {renderCategories}
            </Tabs>
            </AppBar>
            {renderCategoriesTabAndItems}
            
          </div>
           
      </div>

    );
  }
}


export default Home;