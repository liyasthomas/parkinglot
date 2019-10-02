/**
 * Initiate the app at the beginning
 */
(function mounted() {
  getTableData()
  $('#d_o_a').datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: '1900:2200',
    dateFormat: 'dd-mm-yy'
  })
  $('#edit_d_o_a').datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: '1900:2200',
    dateFormat: 'dd-mm-yy'
  })
})()
/**
 * Generating unique ID for new Input
 */
function guid() {
  return parseInt(Date.now() + Math.random())
}
/**
 * Create and Store New Member
 */
var el = document.querySelector('#saveMemberInfo');
if (el) {
    el.addEventListener('submit', saveMemberInfo);
}
function saveMemberInfo(event) {
  event.preventDefault();
  const keys = ['reg_no', 'owner_name', 'email', 'd_o_a', 'slot']
  const obj = {}
  keys.forEach((item, index) => {
    const result = document.getElementById(item).value
    if (result) {
      obj[item] = result;
    }
  })
  var members = getMembers()
  members.forEach((item) => {
    if (obj.slot === item.slot) {
      if (obj.d_o_a === item.d_o_a) {
        alert("Can't allocate slot. Slot is not availabe on the selected day.");
        window.location.reload();
        this.preventDefault();
        return false;
      }
    }
  })
  if (!members.length) {
    $('.show-table-info').addClass('hide')
  }
  if (Object.keys(obj).length) {
    var members = getMembers()
    obj.id = guid()
    members.push(obj)
    const data = JSON.stringify(members)
    localStorage.setItem('members', data)
    el.reset()
    insertIntoTableView(obj, getTotalRowOfTable())
    $('#addnewModal').modal('hide')
  }
}
/**
 * Clear Create New Member Form Data0
 */
function clearFields() {
  $('#input_form')[0].reset()
}
/**
 * Get All Members already stored into the local storage
 */
function getMembers() {
  const memberRecord = localStorage.getItem('members')
  let members = []
  if (!memberRecord) {
    return members
  } else {
    members = JSON.parse(memberRecord)
    return members
  }
}
/**
 * Populating Table with stored data
 */
function getTableData() {
  $('#member_table').find('tr:not(:first)').remove()
  const searchKeyword = $('#member_search').val()
  const members = getMembers()
  const filteredMembers = members.filter(({
      reg_no,
      owner_name,
      email,
      d_o_a,
      slot
    }, index) => reg_no.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    owner_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    d_o_a.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    slot.toLowerCase().includes(searchKeyword.toLowerCase()))
  if (!filteredMembers.length) {
    $('.show-table-info').removeClass('hide')
  } else {
    $('.show-table-info').addClass('hide')
  }
  filteredMembers.forEach((item, index) => {
    insertIntoTableView(item, index + 1)
  })
}
/**
 * Inserting data into the table of the view
 *
 * @param {object} item
 * @param {int} tableIndex
 */
function insertIntoTableView(item, tableIndex) {
  const table = document.getElementById('member_table')
  const row = table.insertRow()
  const idCell = row.insertCell(0)
  const firstNameCell = row.insertCell(1)
  const lastNameCell = row.insertCell(2)
  const emailCell = row.insertCell(3)
  const dateOfBirthCell = row.insertCell(4)
  const slotCell = row.insertCell(5)
  const actionCell = row.insertCell(6)
  idCell.innerHTML = tableIndex
  firstNameCell.innerHTML = item.reg_no
  lastNameCell.innerHTML = item.owner_name
  emailCell.innerHTML = item.email
  dateOfBirthCell.innerHTML = item.d_o_a
  slotCell.innerHTML = `<span class="tag">${item.slot}</span>`
  const guid = item.id
  actionCell.innerHTML = `<button class="btn btn-sm btn-secondary" onclick="showMemberData(${guid})">View</button> <button class="btn btn-sm btn-primary" onclick="showEditModal(${guid})">Edit</button> <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${guid})">Delete</button>`
}
/**
 * Get Total Row of Table
 */
function getTotalRowOfTable() {
  const table = document.getElementById('member_table')
  return table.rows.length
}
/**
 * Show Single Member Data into the modal
 *
 * @param {string} id
 */
function showMemberData(id) {
  const allMembers = getMembers()
  const member = allMembers.find(item => item.id == id)
  $('#show_reg_no').val(member.reg_no)
  $('#show_owner_name').val(member.owner_name)
  $('#show_email').val(member.email)
  $('#show_d_o_a').val(member.d_o_a)
  $('#show_slot').val(member.slot)
  $('#showModal').modal()
}
/**
 * Show Edit Modal of a single member
 *
 * @param {string} id
 */
function showEditModal(id) {
  const allMembers = getMembers()
  const member = allMembers.find(item => item.id == id)
  $('#edit_reg_no').val(member.reg_no)
  $('#edit_owner_name').val(member.owner_name)
  $('#edit_email').val(member.email)
  $('#edit_d_o_a').val(member.d_o_a)
  $('#edit_slot').val(member.slot)
  $('#member_id').val(id)
  $('#editModal').modal()
}
/**
 * Store Updated Member Data into the storage
 */
function updateMemberData() {
  if ($('#edit_reg_no').val() == '' || $('#edit_owner_name').val() == '' || $('#edit_email').val() == '' || $('#edit_d_o_a').val() == '' || $('#edit_slot').val() == '') {
    alert("All fields are required");
    window.location.reload();
    this.preventDefault();
    return false;
  }
  var members = getMembers()
  members.forEach((item) => {
    if ($('#edit_slot').val() === item.slot) {
      if ($('#edit_d_o_a').val() === item.d_o_a) {
        alert("Can't allocate slot. Slot is not availabe on the selected day.");
        window.location.reload();
        this.preventDefault();
        return false;
      }
    }
  })
  const allMembers = getMembers()
  const memberId = $('#member_id').val()
  const member = allMembers.find(({
    id
  }) => id == memberId)
  member.reg_no = $('#edit_reg_no').val()
  member.owner_name = $('#edit_owner_name').val()
  member.email = $('#edit_email').val()
  member.d_o_a = $('#edit_d_o_a').val()
  member.slot = $('#edit_slot').val()
  const data = JSON.stringify(allMembers)
  localStorage.setItem('members', data)
  $('#member_table').find('tr:not(:first)').remove()
  getTableData()
  $('#editModal').modal('hide')
}
/**
 * Show Delete Confirmation Dialog Modal
 *
 * @param {int} id
 */
function showDeleteModal(id) {
  $('#deleted-member-id').val(id)
  $('#deleteDialog').modal()
}
/**
 * Delete single member
 */
function deleteMemberData() {
  const id = $('#deleted-member-id').val()
  const allMembers = getMembers()
  const storageUsers = JSON.parse(localStorage.getItem('members'))
  let newData = []
  newData = storageUsers.filter((item, index) => item.id != id)
  const data = JSON.stringify(newData)
  localStorage.setItem('members', data)
  $('#member_table').find('tr:not(:first)').remove()
  $('#deleteDialog').modal('hide')
  getTableData()
}
/**
 * Sorting table data through type, e.g: reg_no, email, owner_name etc.
 *
 * @param {string} type
 */
function sortBy(type) {
  $("#member_table").find("tr:not(:first)").remove();
  var totalClickOfType = parseInt(localStorage.getItem(type));
  if (!totalClickOfType) {
    totalClickOfType = 1;
    localStorage.setItem(type, totalClickOfType);
  } else {
    if (totalClickOfType == 1) {
      totalClickOfType = 2;
    } else {
      totalClickOfType = 1;
    }
    localStorage.setItem(type, totalClickOfType);
  }
  var searchKeyword = $('#member_search').val();
  var members = getMembers();
  var sortedMembers = members.sort(function (a, b) {
    return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
  });
  sortedMembers.forEach(function (item, index) {
    insertIntoTableView(item, index + 1);
  })
}
