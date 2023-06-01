import sys
import os

from debuglog_event_method import Debug_log_Event

json_filename ='./reports/debug.json'

folder_path = './debugLogDownload'

scaletestId = sys.argv[1]

files = os.listdir(folder_path)
event_list_tuples = []

for filename in files:
    if filename.endswith(".log"):

        filename = os.path.join(folder_path, filename)
        
        list_tuples = Debug_log_Event.debug_log_event_seperation(filename)

    event_list_tuples.extend(list_tuples)

Debug_log_Event.debug_json_tree(event_list_tuples,scaletestId,json_filename)
