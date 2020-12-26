# import breitbart data
# create csv of word, word_count
# for each word, get sum of all word_count
# store value in word_count column
# Create lollipop graph, x axis = total, y axis = word

import csv


def main():

	with open("breitbartData.csv") as the_csv:
		csv_reader = csv.reader(the_csv)
		# print(csv_reader)
		data = list(csv_reader)
		del data[0]
		# print(data)
		total = 0
		our_dict = {}
		_keys = []
		i = 0
		for row in data:
			# print(row)
			if row[1] not in _keys and row[1] != "Word":
				_keys.append(row[1])

		totals = []
		for name in _keys:
			for new_row in data:
				if name == new_row[1]:
					totals.append(int(new_row[2]))
			our_dict[name] = totals
			totals = []

		new_dict = {}
		the_sum = 0
		for key, value in our_dict.items():
			for num in value:
				the_sum += num
				new_dict[key] = the_sum
			the_sum = 0

			main_list = []

	for key, value in new_dict.items():
		main_list.append([key, value])


		
	with open("bb_totals.csv", "w") as new_csv:
		csv_writer = csv.writer(new_csv)
		for item in main_list:
			csv_writer.writerow(item)
		

main()


		# print(our_dict)

	# print(our_dict)

	# for key in keys_:
		# for newrow in csv_reader:
		# 	print(newrow)
	
		
