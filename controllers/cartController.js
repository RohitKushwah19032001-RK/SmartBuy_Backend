import Cart from "../models/Cart.js";


// ADD TO CART

export const addToCart =
  async (req, res) => {

    try {

      const {
        productId
      } = req.body;

      const userId =
        req.userId;

      let cart =
        await Cart.findOne({

          userId

        });


      // AGAR CART NAHI HAI

      if (!cart) {

        cart =
          await Cart.create({

            userId,

            items: [

              {

                productId,

                quantity: 1

              }

            ]

          });

      }

      // AGAR CART EXIST KARTA HAI

      else {

        const itemIndex =
          cart.items.findIndex(

            item =>

              item.productId
                .toString()
              === productId

          );


        // AGAR PRODUCT ALREADY CART ME HAI

        if (itemIndex > -1) {

          cart.items[
            itemIndex
          ].quantity += 1;

        }

        // AGAR NEW PRODUCT HAI

        else {

          cart.items.push({

            productId,

            quantity: 1

          });

        }

        await cart.save();

      }


      res.json({

        success: true,

        message:
          "Added to Cart"

      });

    } catch (error) {

      res.json({

        success: false,

        message: error.message

      });

    }

  };



// GET CART

export const getCart =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const cart =
        await Cart.findOne({

          userId

        })

          .populate({

            path: "items.productId",

            populate: {
              path: "shopId",
              select: "shopName"
            }

          });


      res.json({

        success: true,

        cart

      });

    } catch (error) {

      res.json({

        success: false,

        message: error.message

      });

    }

  };



// REMOVE ITEM

export const removeFromCart =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const {
        productId
      } = req.body;

      const cart =
        await Cart.findOne({

          userId

        });


      cart.items =
        cart.items.filter(

          item =>

            item.productId
              .toString()
            !== productId

        );

      await cart.save();


      res.json({

        success: true,

        message:
          "Item Removed"

      });

    } catch (error) {

      res.json({

        success: false,

        message: error.message

      });

    }

  };



// UPDATE QTY

export const updateQty =
  async (req, res) => {

    try {

      const userId =
        req.userId;

      const {
        productId,
        quantity
      } = req.body;


      const cart =
        await Cart.findOne({

          userId

        });


      const item =
        cart.items.find(

          i =>

            i.productId
              .toString()
            === productId

        );


      item.quantity =
        quantity;


      await cart.save();


      res.json({

        success: true

      });

    } catch (error) {

      res.json({

        success: false,

        message: error.message

      });

    }

  };