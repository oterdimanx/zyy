
import Cookies from "js-cookie";

export const get_all_lookbooks = async () => {
  try {
    const res = await fetch('/api/common/lookbook/getLookbook', {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all Lookbooks (service) =>', error)
  }
}

export const add_new_lookbook = async (formData: any) => {
  try {
      const res = await fetch(`/api/Admin/lookbook/add-lookbook`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('token')}`
          },
          body: JSON.stringify(formData),
      });
      const data = await res.json();
      return data;
  } catch (error) {
      console.log('Error in Add New Lookbook (service) =>', error);
  }
}

export const delete_a_lookbook = async (id:string) => {
  try {
    const res = await fetch(`/api/Admin/lookbook/delete-lookbook?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Lookbooks (service) =>', error)
  }
}

export const update_a_lookbook = async (formData : any) => {
  try {
    const res = await fetch(`/api/Admin/lookbook/update-lookbook`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating Lookbooks (service) =>', error)
  }

}

export const archive_a_lookbook = async (formData : any) => {
  try {
    const res = await fetch(`/api/Admin/archive/add-archive`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in creating an Archive from a Lookbook (lookbook service) =>', error)
  }

}

export const get_lookbook_by_id = async (id:string) => {
  try {
    const res = await fetch(`/api/common/lookbook/get-lookbook-by-id?id=${id}`, {
      method: 'GET',
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting Lookbook by ID (service) =>', error)
  }
}

export const delete_an_image = async (id:string) => {
  try {
    const res = await fetch(`/api/Admin/image/delete-image?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Image (lookbook service) =>', error)
  }
}