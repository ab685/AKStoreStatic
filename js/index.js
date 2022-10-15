 var localCache = {
                data: {},
                remove: function (url) {
                    delete localCache.data[url];
                },
                exist: function (url) {
                    return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
                },
                get: function (url) {
                    console.log('Getting in cache for url' + url);
                    return localCache.data[url];
                },
                set: function (url, cachedData, callback) {
                    localCache.remove(url);
                    localCache.data[url] = cachedData;
                    if ($.isFunction(callback)) callback(cachedData);
                }
            };

$(document).ready(function () {
    $('.carousel').carousel({
        interval: 2000
    });
    GetProductData();

});
window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
function GetProductData() {
    var htmlstr = sessionStorage.getItem("html");
    if (htmlstr) {
        $("#divProduct").html(htmlstr);
    } else {
        $.ajax({
            type: "GET",
            url: 'http://abhi.wfire.in/common/GetProducts',
            cache: true,
            beforeSend: function () {
                if (localCache.exist("http://abhi.wfire.in/common/GetProducts")) {
                    BindProduct(localCache.get("http://abhi.wfire.in/common/GetProducts"));
                    return false;
                }
                return true;
            },
            complete: function (jqXHR, textStatus) {
                localCache.set("http://abhi.wfire.in/common/GetProducts", jqXHR, BindProduct);
            },
            error: function (error) {
                alert(error.Error);
            }
        });
    }
}
function BindProduct(response) {
    var grouppedData = groupBy(JSON.parse(response.responseText).data, 'CategoryName');
    var html = '';
    for (var category in grouppedData) {
        html += `<div class="shadow col-12  text-white text-uppercase font-weight-bold text-center  mt-4 p-2 categoryDiv" style="margin-left:1rem;"><h6>${category}</h6></div>`;
        grouppedData[category].forEach(function (item) {
            var fileName = 'http://abhi.wfire.in//Documents/images/product/' + item.FilePath;
            html += `<div class="col-6 col-lg-3 col-md-4  mt-2">
                                    <div class="card h-100 shadow cardhover">
                                    <img class="card-img-top" style="max-height:200px !important;" src="${fileName}" alt="Card image cap">
                                    <div class="card-body bg-light" >  <p class="lead">${item.Name}</p>
                                     </div>
                                </div>
                                </div>`;
        });
    }
    sessionStorage.setItem("html", html);
    $("#divProduct").html(html);
}
var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
