import React from 'react';

const Comment = () => {
 let slider_images = [
      'https://s3.amazonaws.com/uifaces/faces/twitter/mijustin/128.jpg',
      'https://s3.amazonaws.com/uifaces/faces/twitter/keizgoesboom/128.jpg',
      'https://s3.amazonaws.com/uifaces/faces/twitter/mijustin/128.jpg',
      'https://s3.amazonaws.com/uifaces/faces/twitter/keizgoesboom/128.jpg',
      'https://s3.amazonaws.com/uifaces/faces/twitter/mijustin/128.jpg'  
    ]
  return (
     <div>
        <div className="back-top" title="Top of Page"><i className="fa fa-arrow-up"></i></div>
        <section className="feedabck-section">
           <div className="container">
              <div className="col-md-12 text-center">
                 <h3 className="text-uppercase white">what say people</h3>
              </div>
              <div id="demo" className="carousel slide" data-ride="carousel">
                 <ul className="carousel-indicators">
                    {slider_images.map(function (img, index) {
                       var imgstyle = {
                          backgroundImage: 'url(' + img + ')'
                       }
                       return <li style={imgstyle} key={index} data-target="#demo" data-slide-to="0" className="active"></li>;
                    })}
                 </ul>
                 <div className="carousel-inner">
                    <div className="carousel-item active">
                       <div className="col-md-8 offset-md-2">
                          <div className="caption text-center">
                             <i className="fa fa-quote-left fa-3x"></i>
                             <p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
                             <small className="client-name">
                                <h5 className="text-uppercase">JANE GALADRIEL</h5>
                                Someone famous
                           </small>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="col-md-8 offset-md-2">
                          <div className="caption text-center">
                             <i className="fa fa-quote-left fa-3x"></i>
                             <p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
                             <small className="client-name">
                                <h5 className="text-uppercase">JANE GALADRIEL</h5>
                                Someone famous
                           </small>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="col-md-8 offset-md-2">
                          <div className="caption text-center">
                             <i className="fa fa-quote-left fa-3x"></i>
                             <p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
                             <small className="client-name">
                                <h5 className="text-uppercase">JANE GALADRIEL</h5>
                                Someone famous
                           </small>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="col-md-8 offset-md-2">
                          <div className="caption text-center">
                             <i className="fa fa-quote-left fa-3x"></i>
                             <p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
                             <small className="client-name">
                                <h5 className="text-uppercase">JANE GALADRIEL</h5>
                                Someone famous
                           </small>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="col-md-8 offset-md-2">
                          <div className="caption text-center">
                             <i className="fa fa-quote-left fa-3x"></i>
                             <p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
                             <small className="client-name">
                                <h5 className="text-uppercase">JANE GALADRIEL</h5>
                                Someone famous
                           </small>
                          </div>
                       </div>
                    </div>
                 </div>
                 <a className="carousel-control-prev" href="#demo" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                 </a>
                 <a className="carousel-control-next" href="#demo" data-slide="next">
                    <span className="carousel-control-next-icon"></span>
                 </a>
              </div>
           </div>
        </section>
     </div>
  );
}

export default Comment;
