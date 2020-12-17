describe('Deviget NASA Challenge', () => {
    it('Retrieve the first 10 Mars photos made by "Curiosity" on 1000 Martian sol', () => {
         cy.request({
            method: 'GET',
            url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY&page=1',
            followRedirect: false,
            headers: {
                'accept': 'application/json'
            }
        }).then((result) => {
            expect(result.status).to.eq(200);
            let body = result.body['photos'];
            let photos = [];
            for(var index = 0; index < 10; index++){
                photos.push(body[index]);
            };
            cy.log(photos);
        });
    });

    it('Retrieve the first 10 Mars photos made by "Curiosity" on Earth date equal to 1000 Martian sol', () => {
        cy.request({
           method: 'GET',
           url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-05-30&api_key=DEMO_KEY&page=1',
           followRedirect: false,
           headers: {
               'accept': 'application/json'
           }
       }).then((result) => {
           expect(result.status).to.eq(200);
           let body = result.body['photos'];
           let photos = [];
           for(var index = 0; index < 10; index++){
               expect(body[index]['sol']).to.eq(1000);
               photos.push(body[index]);
           };
           cy.log(photos);
       });
   });

   it('Retrieve and compare the first 10 Mars photos made by "Curiosity" on 1000 sol and on Earth date equal to 1000 Martian sol.', () => {
        let sol = [];
        let earth_date = [];
    
        cy.request({
            method: 'GET',
            url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY&page=1',
            followRedirect: false,
            headers: {
                'accept': 'application/json'
            }
        }).then((result) => {
            expect(result.status).to.eq(200);
            let body = result.body['photos'];
            for(var index = 0; index < 10; index++){
                sol.push(body[index]);
            };
        });

        cy.request({
            method: 'GET',
            url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-05-30&api_key=DEMO_KEY&page=1',
            followRedirect: false,
            headers: {
                'accept': 'application/json'
            }
        }).then((result) => {
            expect(result.status).to.eq(200);
            let body = result.body['photos'];
            for(var index = 0; index < 10; index++){
                earth_date.push(body[index]);
                expect(JSON.stringify(sol[index])).to.equal(JSON.stringify(earth_date[index]));
            };
        });
    });

    it('Validate that the amounts of pictures that each "Curiosity" camera took on 1000 Mars sol is not greater than 10 times the amount taken by other cameras on the same date', () => {
        const cameras = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'];
        var allPhotos;
        
        cy.request({
            method: 'GET',
            url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
            qs: {
                sol: 1000,
                api_key: 'DEMO_KEY',
                earth_date: '2015-05-30'
              },
            followRedirect: false,
            headers: {
                'accept': 'application/json'
            }
        }).then((result) => {
            allPhotos = result.body['photos'].length;
        });

        for (var index = 0; index < cameras.length; index++) {
            const cameraName = cameras[index];
            cy.request({
                method: 'GET',
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
                qs: {
                    sol: 1000,
                    camera: cameraName,
                    earth_date: '2015-05-30',
                    api_key: 'DEMO_KEY'
                  },
                followRedirect: false,
                headers: {
                    'accept': 'application/json'
                }
            }).then((result) => {
                var cameraPhotos = result.body['photos'].length;
                var compareValue = (allPhotos - cameraPhotos) * 10;
                if(cameraPhotos < compareValue) {
                    cy.log(`The amounts of pictures for ${cameraName} camera is not greater than 10 times the amount taken by other cameras on the same date.`);
                } else {
                    cy.log(`The amounts of pictures for ${cameraName} camera is greater than 10 times the amount taken by other cameras on the same date.`);
                }
            });
        };
   });
})