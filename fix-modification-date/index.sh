#!/usr/bin/env bash

dir=$1

date_regex="[0-9]{8}"
time_regex="[0-9]{6}"
name_regex=".*(${date_regex})[_-](${time_regex}).*"

for file_path in "${dir}"/*.*; do
    if [[ "$file_path" =~ $name_regex ]] ; then
        file_name_date=${BASH_REMATCH[1]}
        file_name_time=${BASH_REMATCH[2]}

        # Mac OS specific!
        file_name_datetime=$(date -j -f "%Y%m%d %H%M%S" "${file_name_date} ${file_name_time}")
        file_modification_datetime=$(date -r "$file_path")

        default_format="%a %b %d %T %Z %Y"
        diff=$((`date -j -f "$default_format" "$file_modification_datetime" "+%s"` - `date -j -f "$default_format" "$file_name_datetime" "+%s"`))
        abs_diff=${diff/#-/}
        threshold=$((24*60*60)) # 1 day

        if [[ ${abs_diff} -gt ${threshold} ]]; then
            touch_format="%Y%m%d%H%M.%S"
            file_name_datetime_for_touch=$(date -j -f "$default_format" "$file_name_datetime" "+$touch_format")

            touch -t "$file_name_datetime_for_touch" "$file_path"
        fi
    fi
done
