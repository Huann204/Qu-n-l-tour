// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if(buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  })

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  })
}
// End Menu Mobile

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if(listFilepondImage.length > 0) {
  listFilepondImage.forEach(filepondImage => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

     let files = null;
    const elementImageDefault = filepondImage.closest("[image-default]");
    if(elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if(imageDefault) {
        files = [
          {
            source: imageDefault, // Đường dẫn ảnh
          },
        ]
      }
    }

    filePond[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: '+',
      files: files
    });
  });
}
// End Filepond Imag

// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll("[filepond-image-multi]");
let filePondMulti = {};
if(listFilepondImageMulti.length > 0) {
  listFilepondImageMulti.forEach(filepondImage => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementListImageDefault = filepondImage.closest("[list-image-default]");
    if(elementListImageDefault) {
      let listImageDefault = elementListImageDefault.getAttribute("list-image-default");
      if(listImageDefault) {
        listImageDefault = JSON.parse(listImageDefault);
        files = [];
        listImageDefault.forEach(image => {
          files.push({
            source: image, // Đường dẫn ảnh
          });
        })
      }
    }

    filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: '+',
      files: files,
    });
  });
}
// End Filepond Image Multi


// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if(categoryCreateForm) {
  const validation = new JustValidate('#category-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();
      
       // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);
      
     fetch(`/${pathAdmin}/category/create`, {
      method: "POST",
      body: formData
     })
      .then(res => res.json())
      .then(data => {
        if(data.code === "error") {
          alert(data.message);
        }

        if(data.code === "success") {
          window.location.href = `/${pathAdmin}/category/list`;
        }
      })
    });
}
// End Category Create Form

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if(categoryEditForm) {
  const validation = new JustValidate('#category-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }
      const description = tinymce.get("description").getContent();


      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);
      
     fetch(`/${pathAdmin}/category/edit/${id}`, {
      method: "PATCH",
      body: formData
     })
      .then(res => res.json())
      .then(data => {
        if(data.code === "error") {
          alert(data.message);
        }

        if(data.code === "success") {
          window.location.reload();
        }
      })
    })
  ;
}
// End Category Edit Form


// Setting Website Info Form
const settingWebsiteInfoForm = document.querySelector("#setting-website-info-form");
if(settingWebsiteInfoForm) {
  const validation = new JustValidate('#setting-website-info-form');

  validation
    .addField('#websiteName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên website!'
      },
    ])
    .addField('#email', [
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if(logos.length > 0) {
        logo = logos[0].file;
      }
      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if(favicons.length > 0) {
        favicon = favicons[0].file;
      }

      console.log(websiteName);
      console.log(phone);
      console.log(email);
      console.log(address);
      console.log(logo);
      console.log(favicon);
    })
  ;
}
// End Setting Website Info Form


// Setting Role Create Form
const settingRoleCreateForm = document.querySelector("#setting-role-create-form");
if(settingRoleCreateForm) {
  const validation = new JustValidate('#setting-role-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      console.log(name);
      console.log(description);
      console.log(permissions);
    })
  ;
}
// End Setting Role Create Form

// Setting Account Admin Create Form
const settingAccountAdminCreateForm = document.querySelector("#setting-account-admin-create-form");
if(settingAccountAdminCreateForm) {
  const validation = new JustValidate('#setting-account-admin-create-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập chức vụ!'
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!',
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }

      console.log(fullName);
      console.log(email);
      console.log(phone);
      console.log(role);
      console.log(positionCompany);
      console.log(status);
      console.log(password);
      console.log(avatar);
    })
  ;
}
// End Setting Account Admin Create Form


// Logout
  const buttonLogout = document.querySelector(".sider .inner-logout");  
    if(buttonLogout) {
      buttonLogout.addEventListener("click", () => {
        fetch(`/${pathAdmin}/account/logout`, {
          method: "POST"
        })
          .then(res => res.json())
          .then(data => {
            if(data.code === "success") {
              window.location.href = `/${pathAdmin}/account/login`;
            }
          })
      })
    }


// End Logout

// Alert
const alertTime = document.querySelector("[alert-time]");
if(alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // xóa phần tử khỏi giao diện
  }, time);
}

// End Alert

// Button Delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");
      

      fetch(dataApi, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === "error") {
            alert(data.message);
          };

          if(data.code === "success") {
            window.location.reload();
          };
          
        })
    })
  })
  
}

// End Button Delete

// Filter Status 

const filterStatus = document.querySelector("[filter-status]");
if(filterStatus) {
  const url = new URL(window.location.href);
  

  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if(value) {
      url.searchParams.set("status", value);
    }else {
      url.searchParams.delete("status");
    };

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("status");
  if(valueCurrent) {
    filterStatus.value = valueCurrent;
  }
}

// End Filter Status 

// Sider
const sider = document.querySelector(".sider");
if(sider) {
  const pathNameCurrent = window.location.pathname;
  // console.log(pathNameCurrent);
  const splitPathNameCurrent = pathNameCurrent.split("/");
  // console.log(splitPathNameCurrent);
  
  const menuList = sider.querySelectorAll("a");
  menuList.forEach(item => {
    const href = item.href;
    const pathName = new URL(href).pathname;
    // console.log(pathName);
    const splitPathName = pathName.split("/");
    if(splitPathNameCurrent[1] === splitPathName[1] && splitPathNameCurrent[2] === splitPathName[2]) {
      item.classList.add("active");
    }
  })
}

/**
 * Note: trung khop thi active
 */
// End Sider

// Schedule Section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if(scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const listItem = scheduleSection8.querySelector(".inner-schedule-list");

  // Tạo mới
  if(buttonCreate) {
    buttonCreate.addEventListener("click", () => {
      const firstItem = listItem.querySelector(".inner-schedule-item");
      const cloneItem = firstItem.cloneNode(true);
      cloneItem.querySelector(".inner-schedule-head input").value = "";

      const body = cloneItem.querySelector(".inner-schedule-body");
      const id = `mce_${Date.now()}`;
      body.innerHTML = `<textarea textarea-mce id="${id}"></textarea>`;

      listItem.appendChild(cloneItem);

      initTinyMCE(`#${id}`);
    })
  }

  listItem.addEventListener("click", (event) => {
    // Đóng/mở item
    if(event.target.closest('.inner-more')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      if (parentItem) {
        parentItem.classList.toggle('hidden');
      }
    }

    // Xóa item
    if(event.target.closest('.inner-remove')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      const totalItem = listItem.querySelectorAll(".inner-schedule-item").length;
      if (parentItem && totalItem > 1) {
        parentItem.remove();
      }
    }
  })

  // Sắp xếp
  new Sortable(listItem, {
    animation: 150, // Thêm hiệu ứng mượt mà
    handle: ".inner-move", // Chỉ cho phép kéo bằng class .inner-move
    onStart: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    }
  });
}
// End Schedule Section 8

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if(tourCreateForm) {
  const validation = new JustValidate('#tour-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourCreateForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourCreateForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));

      // images
      if(filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach(item => {
          formData.append("images", item.file);
        })
      }
      // End images


      fetch(`/${pathAdmin}/tour/create`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === "error") {
            alert(data.message);
          };

          if(data.code === "success") {

            window.location.href = `/${pathAdmin}/tour/list`;
          };
        })
    })
  ;
}
// End Tour Create Form

// Tour Edit Form
const tourEditForm = document.querySelector("#tour-edit-form");
if(tourEditForm) {
  const validation = new JustValidate('#tour-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourEditForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourEditForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules

      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));

       // images
      if(filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach(item => {
          formData.append("images", item.file);
        })
      }
      // End images


      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
    })
  ;
}
// End Tour Edit Form

// Check All
const checkAll = document.querySelector("[check-all]");
if(checkAll) {
  checkAll.addEventListener("click", () => {
    const listCheckItem = document.querySelectorAll("[check-item]");
    listCheckItem.forEach(item => {
      item.checked = checkAll.checked;
    })
  })
};
// End Check All

// Change Multi

const changeMulti = document.querySelector('[change-multi]');
if(changeMulti) {
 const select = changeMulti.querySelector("select");
 const button = changeMulti.querySelector("button");
 const dataApi = changeMulti.getAttribute("data-api");

 button.addEventListener("click", () => {
  const option = select.value;
  let listInputChecked = document.querySelectorAll("input[type='checkbox']:checked");
  if(option && listInputChecked.length > 0) {
    const ids = [];
    listInputChecked.forEach(item => {
      const id = item.getAttribute("check-item");
      if(id) {
        ids.push(id);
      }
    });

    const dataFinal = {
      option: option,
      ids: ids
    };

    fetch(dataApi, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataFinal)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code === "error") {
          alert(data.message);
        };

        if(data.code === "success") {
          window.location.reload();        
        }
      });
    
  }else {
    alert("Vui lòng chọn option và danh mục muốn thực hiện!")
  };

 })
  
}

// End Change Multi

// Filter createdBy

const filterCreatedBy = document.querySelector("[filter-created-by]");
if(filterCreatedBy) {
  const url = new URL(window.location.href);
  
  filterCreatedBy.addEventListener("change", () => {
    const value = filterCreatedBy.value;
    if(value) {
      url.searchParams.set("createdBy", value);
    }else {
      url.searchParams.delete("createdBy");
    };

    window.location.href = url.href;
  });

  // Hiển thị trên màn hình
  const valueCurrent = url.searchParams.get("createdBy");
  if(valueCurrent) {
    filterCreatedBy.value = valueCurrent;
  };

}

// End Filter createdBy

// Filter startDate

const filterStartDate = document.querySelector("[filter-start-date]");
if(filterStartDate) {
  const url = new URL(window.location.href);
  
  filterStartDate.addEventListener("change", () => {
    const value = filterStartDate.value;
    if(value) {
      url.searchParams.set("startDate", value);
    }else {
      url.searchParams.delete("startDate");
    };

    window.location.href = url.href;
  });

  // Hiển thị trên màn hình
  const valueCurrent = url.searchParams.get("startDate");
  if(valueCurrent) {
    filterStartDate.value = valueCurrent;
  };

}

// End Filter startDate

// Filter endDate

const filterEndDate = document.querySelector("[filter-end-date]");
if(filterEndDate) {
  const url = new URL(window.location.href);
  
  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if(value) {
      url.searchParams.set("endDate", value);
    }else {
      url.searchParams.delete("endDate");
    };

    window.location.href = url.href;
  });

  // Hiển thị trên màn hình
  const valueCurrent = url.searchParams.get("endDate");
  if(valueCurrent) {
    filterEndDate.value = valueCurrent;
  };

}

// End Filter endDate

// Filter category
const filterCategory = document.querySelector("[filter-category]");
if(filterCategory) {
  
  let url = new URL(window.location.href);
  filterCategory.addEventListener("change", () => {
    const value = filterCategory.value;
    if(value) {
      url.searchParams.set("category", value);
    }else {
      url.searchParams.delete("category");
    }

    window.location.href = url.href;
  })

  const currentValue = url.searchParams.get("category");
  if(currentValue) {
    filterCategory.value = currentValue;
  }
  
}

// End Filter category

// Filter price
const filterPrice = document.querySelector("[filter-price]");
if(filterPrice) {
  
  let url = new URL(window.location.href);
  filterPrice.addEventListener("change", () => {
    const value = filterPrice.value;
    if(value) {
      url.searchParams.set("price", value);
    }else {
      url.searchParams.delete("price");
    }

    window.location.href = url.href;
  })

  const currentValue = url.searchParams.get("price");
  if(currentValue) {
    filterPrice.value = currentValue;
  }
  
}

// End Filter price

// Filter reset
const filterReset = document.querySelector('[filter-reset]');
if(filterReset) {
  const url = new URL(window.location.href);
  

  filterReset.addEventListener("click", () => {
    url.search = "";    
    window.location.href = url.href;    
  })
}

// End Filter reset

// Pagination
const pagination = document.querySelector("[pagination]");
if(pagination) {
  let url = new URL(window.location.href);

  pagination.addEventListener("change", () => {
    let value = pagination.value;

    if(value) {
      url.searchParams.set("page", value);
    }else {
      url.searchParams.delete("page");
    };

    window.location.href = url.href;    
  })

  const currentValue = url.searchParams.get("page");
  if(currentValue) {
    pagination.value = currentValue;
  }
  
}


// End Pagination

// Search
const search = document.querySelector("[search]");
if(search) {
  let url = new URL(window.location.href);

  search.addEventListener("keyup", (event) => {
    if(event.code === "Enter" ) {
    
      const value = search.value;
      if(value) {
        url.searchParams.set("keyword", value.trim());
      }else {
        url.searchParams.delete("keyword");
      };

      window.location.href = url.href;
    };
  })

    // Khôi phục keyword khi load trang
    const valueCurrent = url.searchParams.get("keyword");
    if(valueCurrent) {
      search.value = valueCurrent;
    }
}

// End Search

