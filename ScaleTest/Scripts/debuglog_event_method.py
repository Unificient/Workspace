import json

class Debug_log_Event:

    @staticmethod
    def debug_log_event_seperation(file_name):

        event_types = ['CODE_UNIT_STARTED', 'METHOD_ENTRY', 'METHOD_EXIT','DML_BEGIN','DML_END','CODE_UNIT_FINISHED', 'SOQL_EXECUTE_BEGIN', 'SOQL_EXECUTE_END']

        # File handling
        fhand = open(file_name,'r')

        event_logs = fhand.readlines()[1:]

        event_list_tuples = []

        #Assign Values to list_tuples
        for event in event_logs:

            event = event.rstrip()

            for types in event_types:

                #Ignore the log file which has DuplicateDetector
                if 'DuplicateDetector' in event:
                    event_list_tuples = []
                    break
               
                #Checks for the event_types
                if types in event:
                    event = event.split(' ',1)
                    part = event[1].split('|')
                    time = part[0].strip('()')

                    event_type, class_method_name = part[1], part[-1]

                    # Appeding to list_tuples
                    event_list_tuples.append((event_type,class_method_name,time))

        return event_list_tuples

    @staticmethod
    def debug_json_tree(event_list_tuples,scaletestId,json_filename):

            # Initialize the root of the tree
            root = {
                "startTime": "",
                "endTime": "",
                "username": "",
                "testId": scaletestId,
                "filename": "debug",
                "children": []
            }

            # Initialize the stack with the root node and its start time
            stack = [(root, int(event_list_tuples[0][2]))]
            #stack = [(root, None)]
            # Loop through each tuple in the list
            for i in range(0, len(event_list_tuples)):
                event_type, event_info, event_time = event_list_tuples[i]

                # Check if the event type is a CODE_UNIT_STARTED event or a METHOD_ENTRY event
                if event_type in ('CODE_UNIT_STARTED', 'METHOD_ENTRY'):
                    current_node = {
                        "name": event_info,
                        "time": "",
                        "children": []
                    }

                    stack[-1][0]["children"].append(current_node)
                    stack.append((current_node, int(event_time)))

                # Check if the event type is a CODE_UNIT_FINISHED event or a METHOD_EXIT event
                elif event_type in ('CODE_UNIT_FINISHED', 'METHOD_EXIT'):
                    current_node, start_time = stack.pop()
                    duration = int(event_time) - start_time
                    current_node["time"] = str(duration)

                    # Remove empty children
                    if not current_node["children"]:
                        del current_node["children"]

                # Check if the event type is a DML_BEGIN event
                elif event_type == 'DML_BEGIN':
                    rows_value = event_info.split(":")[1]
                    dml_node = {
                        "name": "dml",
                        "children": [{"Rows": rows_value,"time": ""}]
                    }
                    stack[-1][0]["children"].append(dml_node)
                    stack.append((dml_node, int(event_time)))

                # Check if the event type is a DML_END event
                elif event_type == 'DML_END':
                    current_node, start_time = stack.pop()
                    duration = int(event_time) - start_time
                    current_node["children"][0]["time"] = str(duration)

                # Check if the event type is a SOQL_EXECUTE_BEGIN event
                elif event_type == 'SOQL_EXECUTE_BEGIN':
                    soql_node = {
                        "name": "SOQL",
                        "statement": event_info,
                        "Rows": "",
                        "time": "",
                        "children": []
                    }
                    stack[-1][0]["children"].append(soql_node)
                    stack.append((soql_node, int(event_time)))

                # Check if the event type is a SOQL_EXECUTE_END event
                elif event_type == 'SOQL_EXECUTE_END':
                    current_node, start_time = stack.pop()
                    duration = int(event_time) - start_time
                    current_node["time"] = str(duration)

                    #For adding Rows Value
                    rows_value = event_info.split(":")[1]
                    current_node["Rows"] = rows_value

                    # Remove empty children
                    if not current_node["children"]:
                        del current_node["children"]

            #json_tree = json.dumps(root, indent=2)
            print(json_filename)
            with open(json_filename, 'w+') as f:
                json.dump(root, f,indent=4)
