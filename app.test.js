const chai = require('chai');
var assert = chai.assert;

const axios = require('axios').default;

describe('API', function () {
     it('should put customer without error', async function () {
          var result = await axios.put('http://localhost:3000/customer', {
               nameFirst: "John",
               nameLast: "Doe",
               address: {
                    line1: "123 Main St.",
                    city: "New Haven",
                    zip: "94015",
                    country: "United States"
               },
               vehicle: {
                    manufacturer: "Mercedez-Benz",
                    model: "GL-450",
                    year: 2008
               },
               reservation: {
                    year: 2022,
                    month: 4,
                    day: 15,
                    hour: 12,
                    minute: 30,
                    length: 30
               }
          });

          assert.equal(result.status, 200);
          assert.equal(result.data.message, "success!");
     });

     it('should detect customer field missing', async function () {
          try {
               await axios.put('http://localhost:3000/customer', {
                    nameFirst: "John",
                    nameLastFieldNameMispelled: "Doe",
                    address: {
                         line1: "123 Main St.",
                         city: "New Haven",
                         zip: "94015",
                         country: "United States"
                    },
                    vehicle: {
                         manufacturer: "Mercedez-Benz",
                         model: "GL-450",
                         year: 2008
                    }
               });
               assert.fail("should not have been successful");
          }
          catch (err) {
               assert.equal(err.isAxiosError, true);
               assert.equal(err.response.status, 422);
          }
     });
});