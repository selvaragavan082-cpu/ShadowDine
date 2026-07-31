import Restaurant from '../models/Restaurant.js';

export const getRestaurants = async (req, res) => {
  try {
    const { city, search } = req.query;
    let query = {};

    if (city) query.city = new RegExp(city, 'i');
    if (search) query.name = new RegExp(search, 'i');

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const restaurant = await Restaurant.create({ name, city, address, dishes: [] });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addDish = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { dishName, price, category } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.dishes.push({ dishName, price, category });
    await restaurant.save();

    res.status(200).json({ message: 'Dish added by Admin!', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};