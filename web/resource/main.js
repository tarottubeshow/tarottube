function initScheduleEditor(el) {
  var textarea = $('.schedule-src')
  var editor = CodeMirror.fromTextArea(textarea[0], {
    lineNumbers: true,
    mode: 'text/yaml',
    theme: 'blackboard',
  })
}

$(function() {
  $('.schedule-editor').each(initScheduleEditor)
})
